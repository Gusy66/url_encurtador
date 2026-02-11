FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema para better-sqlite3
RUN apk add --no-cache python3 make g++

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências (incluindo devDependencies para build)
RUN npm install --no-audit --no-fund

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3333

# Build + iniciar (usando SQLite) sem tsx watch
CMD ["sh", "-c", "npm run build && node dist/index-sqlite.js"]
