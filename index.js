import app from './app';
import logger from './utils/logger';
import './loaders/mongoose';

process.on('uncaughtException', (error) => {
  logger.error(`uncaughtException: ${error.stack || error.message}`);
});

process.on('unhandledRejection', (reason) => {
  logger.error(`unhandledRejection: ${reason && reason.stack ? reason.stack : reason}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
