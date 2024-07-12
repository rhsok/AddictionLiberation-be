const swaggerJsDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'node Exporess API',
    },
    servers: [{ url: 'http://localhost:8000' }],
  },
  apis: ['./src/api/routes/*.ts'],
};
const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;