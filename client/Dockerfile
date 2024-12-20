# Build stage
FROM node:20-slim as build
# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
# Copy package files
COPY package.json pnpm-lock.yaml ./
# Clean install dependencies
RUN pnpm install --frozen-lockfile
# Copy source files
COPY . .
# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine
# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html
# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf
# Expose port 80
EXPOSE 80
# Start nginx
CMD ["nginx", "-g", "daemon off;"]