# publisher/Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

# Install deps - copy package manifest first to benefit from cache
COPY package.json package-lock.json* ./
RUN npm ci --production

# Copy app sources (do NOT copy .env)
COPY . .

EXPOSE 4000
CMD ["node", "server.js"]

