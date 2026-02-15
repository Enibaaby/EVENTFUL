import swaggerJsDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

const swaggerOptions: swaggerJsDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Eventful API',
      version: '1.0.0',
      description: 'API Documentation for the Eventful Ticketing and Event Management Capstone Project',
      contact: {
        name: 'API Support',
        email: 'support@eventful.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: 'Local Development Server',
      },
      // You can add your production Render/Railway URL here later
      // {
        // url: 'https://eventful-api-prod.up.railway.app',
        // description: 'Production Server'
      // }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Look for Swagger tags/comments in all routes and controllers
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerDocs = swaggerJsDoc(swaggerOptions);