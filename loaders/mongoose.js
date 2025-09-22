// getting-started.js
import mongoose from 'mongoose';
import logger from '../utils/logger.js';

let options = {};
if (process.env.NODE_ENV !== 'development') {
  options = { ...options, autoIndex: false };
}

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/ChatApp');
    logger.info(`Database <ChatApp> connected`);
  } catch (error) {
    logger.error(`Database error: ${error}`);
  }
}

main();
