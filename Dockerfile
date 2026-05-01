FROM node:20-slim AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM node:20-slim
WORKDIR /app

# Create non-root user
RUN groupadd -r appgroup && useradd -r -g appgroup appuser

# Install OpenSSL (needed for Prisma) and curl (for healthcheck)
RUN apt-get update && apt-get install -y openssl curl sqlite3 && rm -rf /var/lib/apt/lists/*

WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci

COPY server/ .
RUN npx prisma generate

COPY --from=frontend-builder /app/client/dist /app/client/dist

# Setup database permissions (so Prisma can write to dev.db if needed)
RUN chown -R appuser:appgroup /app

USER appuser

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["npm", "start"]
