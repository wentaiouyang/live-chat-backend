import 'dotenv/config';
import http from 'http';
import app from './app.js';
import logger from './utils/logger.js';
import './loaders/mongoose.js';
import { initSocket } from './loaders/socket.js';

process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException: ${error.stack || error.message}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`unhandledRejection: ${reason && reason.stack ? reason.stack : reason}`);
});

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
