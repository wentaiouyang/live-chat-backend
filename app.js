// server.js
import 'dotenv/config';
import init from './loaders/index.js';
import express from 'express';
import serverless from 'serverless-http';
import connectDB from './loaders/mongoose.js';

const app = express();

// For Vercel serverless: ensure DB connection on each request
// Note: Socket.io is not supported in serverless environments
if (process.env.VERCEL === '1' || process.env.VERCEL) {
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ 
        message: 'Database connection failed', 
        error: error.message 
      });
    }
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

try {
  init(app);
} catch (error) {
  console.error('Failed to initialize app:', error);
}

export default app;
export const handler = serverless(app);
