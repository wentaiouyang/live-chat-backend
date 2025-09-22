import cors from 'cors';
import morgan from 'morgan';
import express from 'express';
import appConfig from '../config/app';
import apiRouter from '../routes/v1/api';

const expressLoader = (app) => {
  app.use(cors());
  app.use(morgan('dev'));
  app.use(express.json());
  app.use(appConfig.api.prefix, apiRouter);

  app.get('/', (req, res) => {
    res.send('Hello Express Backend 🚀');
  });

  return app;
};

export default expressLoader;
