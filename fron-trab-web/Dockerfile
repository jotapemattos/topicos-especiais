# Development stage
FROM node:20-slim

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Clean install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the development server with host flag
CMD ["pnpm", "dev", "--host", "0.0.0.0"]