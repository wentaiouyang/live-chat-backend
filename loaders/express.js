import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import appConfig from '../config/app.js';
import apiRouter from '../routes/v1/api.js';
import swaggerDefinition from '../docs/swaggerDef.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: [
    join(projectRoot, 'controllers', '*.js'),
    join(projectRoot, 'routes', 'v1', '*.js'),
  ],
});

const expressLoader = (app) => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  // Swagger UI at /api/doc
  app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Live Chat API Docs',
  }));
  app.use(appConfig.api.prefix, apiRouter);

  app.get('/', (req, res) => {
    res.send('Hello Express Backend 🚀');
  });

  return app;
};

export default expressLoader;
