FROM node:22-bookworm-slim

# better-sqlite3 stahuje prebuilt binárku; python3+build-essential jsou záloha,
# kdyby prebuild pro danou architekturu neexistoval.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

COPY . .

# DŮLEŽITÉ: ŽÁDNÁ direktiva VOLUME!
# VOLUME vytvoří anonymní svazek, který Coolify při redeployi zahodí → ztráta dat.
# Data drž na hostiteli přes bind mount:
#   /opt/family-feud-data:/data
ENV DATA_DIR=/data
ENV NODE_ENV=production
ENV PORT=3000

RUN mkdir -p /data

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# Seed je idempotentní – při prázdné DB naplní otázky a admina, jinak nedělá nic.
CMD ["sh", "-c", "node seed.js && node server.js"]
