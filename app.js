// server.js
import 'dotenv/config';
import init from './loaders/index.js';
import express from 'express';
import serverless from 'serverless-http';

const app = express();

init(app);

export default app;
export const handler = serverless(app);
