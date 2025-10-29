# Dockerfile
FROM node:18-alpine

WORKDIR /app

# install dependencies first (leverage cache)
COPY package.json package-lock.json ./
RUN npm ci --production

# copy app
COPY . .

# create data dir and ensure permissions
RUN mkdir -p /app/data && chown -R node:node /app

USER node

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]

