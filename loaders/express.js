import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import appConfig from '../config/app.js';
import apiRouter from '../routes/v1/api.js';
import swaggerDefinition from '../docs/swaggerDef.js';

const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: ['./controllers/*.js', './routes/v1/*.js'],
});

const expressLoader = (app) => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  // Swagger UI at /api/doc
  app.use('/api/doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(appConfig.api.prefix, apiRouter);

  app.get('/', (req, res) => {
    res.send('Hello Express Backend 🚀');
  });

  return app;
};

export default expressLoader;
