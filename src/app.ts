import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { authRoutes } from './modules/auth/auth.routes';
import { userRoutes } from './modules/user/user.routes';
import { roadmapRoutes } from './modules/roadmap/roadmap.routes';
import { learningRoutes } from './modules/learning/learning.routes';
import { quizRoutes } from './modules/quiz/quiz.routes';
import { documentRoutes } from './modules/document/document.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

// Global Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for swagger-ui assets to load correctly in all browsers
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI mount
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Raw JSON Swagger spec
app.get('/api/docs.json', (req, res) => {
  res.json(swaggerSpec);
});

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/document', documentRoutes);

// Global Error Handler (Must be registered after all other routes/middlewares)
app.use(errorHandler);

export { app };
export default app;
