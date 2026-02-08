// getting-started.js
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Use env var when running in Docker to reach host MongoDB, fallback to localhost for local dev.
// On macOS/Windows Docker Desktop you can use: mongodb://host.docker.internal:27017/ChatApp
// For Vercel/MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/ChatApp
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ChatApp';

// Connection options optimized for serverless (Vercel) and traditional environments
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  bufferMaxEntries: 0, // Disable mongoose buffering; throw immediately if not connected
  bufferCommands: false, // Disable mongoose buffering
};

if (process.env.NODE_ENV !== 'development') {
  options.autoIndex = false; // Don't build indexes in production
}

// Cache the connection to reuse in serverless environments (like Vercel)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If already connected, return the existing connection
  if (cached.conn) {
    return cached.conn;
  }

  // If connection is in progress, wait for it
  if (!cached.promise) {
    const opts = {
      ...options,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logger.info(`Database <ChatApp> connected`);
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    logger.error(`Database connection error: ${e.message}`);
    throw e;
  }

  return cached.conn;
}

// For traditional server environments, connect immediately
if (process.env.VERCEL !== '1') {
  connectDB();
}

export default connectDB;
