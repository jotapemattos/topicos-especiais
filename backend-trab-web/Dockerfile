# Build stage
FROM node:20-slim AS builder

# Install OpenSSL and other required packages
RUN apt-get update -y && \
    apt-get install -y openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

# Development stage
FROM node:20-slim AS development

# Install OpenSSL and other required packages
RUN apt-get update -y && \
    apt-get install -y openssl

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (not just production)
RUN pnpm install --frozen-lockfile

# Copy built files and source for debugging
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src ./src

# Generate Prisma Client
RUN npx prisma generate

# Create a shell script to handle startup
RUN echo '#!/bin/sh\n\
# Push schema\n\
echo "Pushing database schema..."\n\
npx prisma db push\n\
\n\
# Start application in development mode\n\
echo "Starting application in development mode..."\n\
exec pnpm dev' > /app/start.sh && chmod +x /app/start.sh

# Expose the port your app runs on
EXPOSE 3333

# Start the application with the new startup script
CMD ["/app/start.sh"]