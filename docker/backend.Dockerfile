# Backend Dockerfile
FROM node:20-slim

# Install build dependencies for node-pty
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install Claude Code CLI (assumes it's available via npm or pre-installed)
# For development, we'll mount the host's claude binary
# RUN npm install -g @anthropic/claude-code

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source
COPY src ./src

# Create projects directory
RUN mkdir -p /app/projects

EXPOSE 3000

CMD ["node", "src/server.js"]
