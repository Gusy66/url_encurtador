import Database from 'better-sqlite3'
import { mkdirSync } from 'fs'
import { dirname } from 'path'

export async function initDatabase() {
  try {
    // Criar diretório data se não existir
    const dbPath = './data/url_shortener.db'
    mkdirSync(dirname(dbPath), { recursive: true })
    
    // Conectar ao banco e criar tabela
    const sqlite = new Database(dbPath)
    
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_url TEXT NOT NULL,
        short_code TEXT NOT NULL UNIQUE,
        clicks INTEGER DEFAULT 0 NOT NULL,
        created_at TEXT NOT NULL,
        last_clicked_at TEXT
      )
    `)
    
    sqlite.close()
    console.log('✅ Banco de dados SQLite inicializado com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error)
    throw error
  }
}
