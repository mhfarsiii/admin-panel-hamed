# Simple Vue.js Frontend Panel Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install serve globally
RUN npm install -g serve

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .



# Build the application
RUN npm run build

# Set permissions
RUN chown -R node:node /app

USER node

EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
