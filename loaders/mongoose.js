// getting-started.js
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

let options = {};
if (process.env.NODE_ENV !== 'development') {
  options = { ...options, autoIndex: false };
}

// Use env var when running in Docker to reach host MongoDB, fallback to localhost for local dev.
// On macOS/Windows Docker Desktop you can use: mongodb://host.docker.internal:27017/ChatApp
// const MONGODB_URI = 'mongodb://localhost:27017/ChatApp';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ChatApp';

async function main() {
  try {
    await mongoose.connect(MONGODB_URI, options);
    logger.info(`Database <ChatApp> connected`);
  } catch (error) {
    logger.error(`Database error: ${error}`);
  }
}

main();
