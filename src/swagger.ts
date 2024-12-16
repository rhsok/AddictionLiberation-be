const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'node Exporess API',
    },
    components: {
      securitySchemes: {
        AccessToken: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    servers: [{ url: 'https://api.addictionliberation.kr' }],
  },
  apis: ['./src/api/routes/*.ts'],
};
const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
