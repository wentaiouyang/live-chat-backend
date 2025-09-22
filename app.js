// server.js
require('dotenv').config();
import init from './loaders';
import express from 'express';
import serverless from 'serverless-http';

const app = express();

init(app);

export default app;
export const handler = serverless(app);
