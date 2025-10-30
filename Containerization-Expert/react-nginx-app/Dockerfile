# ---- Stage 1: Build React App ----
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies only when package files change
COPY package*.json ./
RUN npm ci --silent

# Copy the rest of the app source
COPY . .

# Build the app for production
RUN npm run build

# ---- Stage 2: Nginx Serve ----
FROM nginx:1.25-alpine

# Remove default nginx site config
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copy custom config and build files
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# Create non-root user for better security
RUN adduser -D reactuser
USER reactuser

# Expose port 80
EXPOSE 80

# Set a healthcheck (optional but good practice)
HEALTHCHECK CMD wget --spider -q http://localhost/ || exit 1

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]

