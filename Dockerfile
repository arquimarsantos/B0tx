FROM node:22-bookworm-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash appuser
    
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

FROM node:22-bookworm-slim AS runtime
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    aria2 \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --shell /bin/bash appuser

RUN mkdir -p /app/src/bin \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_linux -o /app/src/bin/yt-dlp \
    && chmod +x /app/src/bin/yt-dlp

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/sessions /app/src/db /app/src/tmp \
    && chown -R appuser:appuser /app

USER appuser
ENV NODE_ENV=production

CMD ["node", "index.js"]
