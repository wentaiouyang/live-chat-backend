const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Live Chat Backend API',
    version: '1.0.0',
    description:
      'API documentation for the live chat backend (generated from controller comments).',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export default swaggerDefinition;
