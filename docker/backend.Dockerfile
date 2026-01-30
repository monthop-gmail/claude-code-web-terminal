# Backend Dockerfile
FROM node:20-slim

# Install build dependencies for node-pty and Claude CLI
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI globally
RUN npm install -g @anthropic-ai/claude-code

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY backend/src ./src

# Create projects directory
RUN mkdir -p /app/projects

EXPOSE 3000

CMD ["node", "src/server.js"]
