// server.js
import 'dotenv/config';
import init from './loaders/index.js';
import express from 'express';
import serverless from 'serverless-http';
import connectDB from './loaders/mongoose.js';

const app = express();

// For Vercel serverless: ensure DB connection on each request
if (process.env.VERCEL === '1') {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      res.status(500).json({ message: 'Database connection failed', error: error.message });
    }
  });
}

init(app);

export default app;
export const handler = serverless(app);
