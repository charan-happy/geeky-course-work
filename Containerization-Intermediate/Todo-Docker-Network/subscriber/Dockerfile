# subscriber/Dockerfile
FROM node:18-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --production

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]

