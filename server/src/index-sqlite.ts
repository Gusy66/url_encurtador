import Fastify from 'fastify'
import cors from '@fastify/cors'
import { z } from 'zod'
import { db } from './db/sqlite-connection'
import { urls } from './db/sqlite-schema'
import { eq } from 'drizzle-orm'
import { initDatabase } from './db/init-sqlite'

const fastify = Fastify({
  logger: true
})

function getShortBaseUrl(request: { protocol: string; hostname: string }) {
  const raw = process.env.SHORT_BASE_URL?.trim()
  if (raw) return raw.replace(/\/+$/, '')
  return `${request.protocol}://${request.hostname}`
}

function makeShortUrl(request: { protocol: string; hostname: string }, shortCode: string) {
  return `${getShortBaseUrl(request)}/r/${shortCode}`
}

// Registrar CORS
fastify.register(cors, {
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
})

function normalizeUrl(input: string) {
  const v = input.trim()
  if (!v) return v
  // aceita "youtube.com" / "www.site.com" e normaliza para URL válida
  if (v.startsWith('http://') || v.startsWith('https://')) return v
  return `https://${v}`
}

// Schema para validação de URL
const createUrlSchema = z.object({
  url: z.preprocess(
    (val) => (typeof val === 'string' ? normalizeUrl(val) : val),
    z.string().url('URL inválida')
  ),
  desiredCode: z
    .string()
    .trim()
    .min(3, 'O código curto deve ter no mínimo 3 caracteres')
    .max(32, 'O código curto deve ter no máximo 32 caracteres')
    .regex(/^[A-Za-z0-9_-]+$/, 'Use apenas letras, números, "_" ou "-"')
    .optional()
})

const paramsSchema = z.object({
  shortCode: z.string().min(1)
})

// Função para gerar código curto
function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Rota para criar URL encurtada
fastify.post('/api/urls', async (request, reply) => {
  try {
    const { url, desiredCode } = createUrlSchema.parse(request.body)
    
    // Verificar se a URL já existe
    const existingUrl = await db.select().from(urls).where(eq(urls.originalUrl, url)).limit(1)
    
    if (existingUrl.length > 0) {
      return reply.send({
        success: true,
        data: {
          shortCode: existingUrl[0].shortCode,
          shortUrl: makeShortUrl(request, existingUrl[0].shortCode),
          originalUrl: existingUrl[0].originalUrl
        }
      })
    }
    
    // Se o usuário definiu um código curto (alias), respeitar essa escolha
    if (desiredCode) {
      const existing = await db.select().from(urls).where(eq(urls.shortCode, desiredCode)).limit(1)
      if (existing.length > 0) {
        return reply.status(409).send({
          success: false,
          error: 'Este código curto já está em uso'
        })
      }
    }
    
    // Gerar código único (ou usar o desejado)
    let shortCode: string = desiredCode ?? generateShortCode()
    while (!desiredCode) {
      const existing = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1)
      if (existing.length === 0) break
      shortCode = generateShortCode()
    }
    
    // Inserir no banco
    const [newUrl] = await db.insert(urls).values({
      originalUrl: url,
      shortCode,
      createdAt: new Date().toISOString()
    }).returning()
    
    return reply.send({
      success: true,
      data: {
        shortCode: newUrl.shortCode,
        shortUrl: makeShortUrl(request, newUrl.shortCode),
        originalUrl: newUrl.originalUrl
      }
    })
  } catch (error) {
    fastify.log.error(error)
    return reply.status(400).send({
      success: false,
      error: 'Erro ao criar URL encurtada'
    })
  }
})

// Rota para listar URLs salvas (para persistir "Meus links" após refresh)
fastify.get('/api/urls', async (request, reply) => {
  try {
    const rows = await db.select().from(urls)
    // Ordena do mais recente para o mais antigo (createdAt é ISO string)
    const ordered = [...rows].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))
    return reply.send({
      success: true,
      data: ordered.map((row) => ({
        shortCode: row.shortCode,
        shortUrl: makeShortUrl(request, row.shortCode),
        originalUrl: row.originalUrl,
        clicks: row.clicks ?? 0
      }))
    })
  } catch (error) {
    fastify.log.error(error)
    return reply.status(500).send({
      success: false,
      error: 'Erro ao listar URLs'
    })
  }
})

// Rota para redirecionar
fastify.get('/r/:shortCode', async (request, reply) => {
  try {
    const { shortCode } = paramsSchema.parse(request.params)
    
    const [url] = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1)
    
    if (!url) {
      return reply.status(404).send({
        success: false,
        error: 'URL não encontrada'
      })
    }
    
    // Incrementar contador de cliques
    await db.update(urls).set({ 
      clicks: url.clicks + 1,
      lastClickedAt: new Date().toISOString()
    }).where(eq(urls.shortCode, shortCode))
    
    return reply.redirect(url.originalUrl)
  } catch (error) {
    fastify.log.error(error)
    return reply.status(400).send({
      success: false,
      error: 'Erro ao redirecionar'
    })
  }
})

// Rota para obter estatísticas
fastify.get('/api/urls/:shortCode/stats', async (request, reply) => {
  try {
    const { shortCode } = paramsSchema.parse(request.params)
    
    const [url] = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1)
    
    if (!url) {
      return reply.status(404).send({
        success: false,
        error: 'URL não encontrada'
      })
    }
    
    return reply.send({
      success: true,
      data: {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
        lastClickedAt: url.lastClickedAt
      }
    })
  } catch (error) {
    fastify.log.error(error)
    return reply.status(400).send({
      success: false,
      error: 'Erro ao obter estatísticas'
    })
  }
})

// Rota de health check
fastify.get('/api/health', async (request, reply) => {
  return reply.send({ status: 'ok', timestamp: new Date().toISOString() })
})

// Iniciar servidor
const start = async () => {
  try {
    // Inicializar banco de dados
    await initDatabase()
    
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3333
    const host = process.env.HOST || '127.0.0.1'
    
    await fastify.listen({ port, host })
    console.log(`🚀 Servidor rodando em http://${host}:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
