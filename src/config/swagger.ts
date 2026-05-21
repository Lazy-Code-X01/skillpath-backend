import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkillPath AI API',
      version: '1.0.0',
      description: 'Backend API documentation for SkillPath AI - an AI-powered personalised learning path platform.',
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production'
          ? `https://${process.env.PUBLIC_DOMAIN}`
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production'
          ? 'Production Server'
          : 'Development Server',
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
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
