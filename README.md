# 🔗 brev.ly - Encurtador de URL

Um sistema completo de encurtamento de URLs desenvolvido com React (Frontend) e Fastify (Backend), utilizando SQLite como banco de dados. Interface moderna baseada em design do Figma.

## 📁 Estrutura do Projeto

```
url_encurtador/
├── web/          # Frontend React + Vite + Tailwind CSS
├── server/       # Backend Fastify + Drizzle ORM + PostgreSQL
└── README.md     # Este arquivo
```

## 🚀 Funcionalidades

- ✅ **Interface moderna** baseada em design do Figma
- ✅ **Layout responsivo** para desktop e mobile
- ✅ **Encurtamento de URLs** com códigos únicos de 6 caracteres
- ✅ **Gestão de links** com nome, URL personalizada e senha
- ✅ **Busca de links** em tempo real
- ✅ **Ações rápidas** (visualizar, copiar, excluir)
- ✅ **Redirecionamento automático** para URLs originais
- ✅ **Páginas de erro** (404) estilizadas
- ✅ **Validação de URLs** com feedback visual
- ✅ **SQLite** como banco de dados (sem configuração)

## 🛠️ Tecnologias Utilizadas

### Frontend (web/)
- **React 18** - Biblioteca para interface de usuário
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Lucide React** - Ícones

### Backend (server/)
- **Fastify** - Framework web rápido
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados relacional
- **Zod** - Validação de schemas
- **CORS** - Configuração de CORS

## 📋 Pré-requisitos

- Node.js 18+ 
- npm (ou yarn)

## 🚀 Instalação e Execução (Manual)

**1. Instale as dependências:**
```bash
# Backend
cd server
npm install

# Frontend  
cd ../web
npm install
```

**2. Execute a aplicação:**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd web
npm run dev
```
## 📋 Notas
- **Banco**: o backend usa **SQLite** por padrão (sem configuração).
- **Acesso**: frontend em `http://localhost:5173` e backend em `http://localhost:3333`.

## 🌍 Link curto “bonito” (sem `:3333`) — Opção 3

Para o link encurtado sair com **um domínio e sem porta** (ex.: `https://meu-dominio/r/abc123`), você precisa colocar um **túnel/reverse proxy** na frente do backend.

### Opção 3A — ngrok (mais simples)

1) Suba o backend normalmente:

```bash
cd server
npm run dev
```

2) Em outro terminal, crie um túnel para a porta 3333:

```bash
ngrok http 3333
```

3) Copie o domínio gerado (ex.: `https://xxxx.ngrok-free.app`) e rode o backend com:

```bash
# PowerShell (na pasta server)
$env:SHORT_BASE_URL="https://xxxx.ngrok-free.app"
npm run dev
```

Agora o backend vai responder `shortUrl` como `https://xxxx.ngrok-free.app/r/<codigo>` (sem `:3333`).

### Opção 3B — Cloudflare Tunnel

1) Suba o backend normalmente (porta 3333).

2) Crie o túnel apontando para `http://localhost:3333` (o comando exato depende do seu setup do `cloudflared`).

3) Defina `SHORT_BASE_URL` com o domínio do túnel e reinicie o backend.

## 🚀 Executando o Projeto

### Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

### Produção

**Backend:**
```bash
cd server
npm run build
npm start
```

**Frontend:**
```bash
cd web
npm run build
npm run preview
```

## 🌐 Acessando a Aplicação

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3333
- **Health Check:** http://localhost:3333/api/health

## 📚 API Endpoints

### POST /api/urls
Cria uma nova URL encurtada.

**Request:**
```json
{
  "url": "https://exemplo.com/url-muito-longa"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "shortUrl": "http://localhost:3333/r/abc123",
    "originalUrl": "https://exemplo.com/url-muito-longa"
  }
}
```

### GET /r/:shortCode
Redireciona para a URL original.

### GET /api/urls/:shortCode/stats
Obtém estatísticas de uma URL encurtada.

**Response:**
```json
{
  "success": true,
  "data": {
    "shortCode": "abc123",
    "originalUrl": "https://exemplo.com/url-muito-longa",
    "clicks": 5,
    "createdAt": "2024-01-15T10:30:00Z",
    "lastClickedAt": "2024-01-15T14:20:00Z"
  }
}
```

### GET /api/health
Verifica se a API está funcionando.

## 🗄️ Estrutura do Banco de Dados

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  clicks INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_clicked_at TIMESTAMP
);
```

## 🧪 Testando a Aplicação

1. Acesse http://localhost:5173
2. Digite uma URL longa no campo
3. Clique em "Encurtar"
4. Copie a URL encurtada gerada
5. Teste o redirecionamento acessando a URL encurtada
6. Verifique as estatísticas na interface

## 📝 Scripts Disponíveis

### Backend (server/)
- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila o TypeScript
- `npm start` - Executa a versão compilada
- `npm run db:generate` - Gera migrações do banco
- `npm run db:migrate` - Executa migrações
- `npm run db:studio` - Abre o Drizzle Studio

### Frontend (web/)
- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Compila para produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa o linter

## 🐛 Solução de Problemas

### Erro de conexão com o banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `psql -h localhost -U usuario -d url_shortener`

### Frontend não carrega
- Verifique se o backend está rodando na porta 3333
- Confirme se o proxy está configurado no `vite.config.ts`

### Erro de CORS
- Verifique se as origens estão configuradas no servidor
- Confirme se o frontend está rodando na porta 5173

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

## 👨‍💻 Desenvolvido por

[Seu Nome] - Projeto para a faculdade

---

**Nota:** Este projeto segue a estrutura solicitada pela faculdade com as pastas `web/` e `server/` separadas para facilitar a avaliação.
