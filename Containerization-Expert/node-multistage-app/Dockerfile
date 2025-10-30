# ---- Stage 1: Build and Install Dependencies ----
FROM node:20 AS build

# Set working directory
WORKDIR /app

# Copy only package files first (for caching)
COPY package*.json ./

# Install dependencies (no dev dependencies in production)
RUN npm ci --only=production

# Copy application code
COPY . .

# ---- Stage 2: Runtime (Lightweight Node Alpine) ----
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only required files from build stage
COPY --from=build /app /app

# Use non-root user for security
RUN adduser -D nodeuser
USER nodeuser

# Expose application port
EXPOSE 3000

# Healthcheck (optional)
HEALTHCHECK CMD wget --spider -q http://localhost:3000/ || exit 1

# Start the app
CMD ["node", "server.js"]

