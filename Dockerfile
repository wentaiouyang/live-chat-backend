FROM node:18-alpine

WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy project source code
COPY . .

# Environment
ENV NODE_ENV=production
ENV PORT=3000

# Expose the application port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]
