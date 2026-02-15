import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

// Import separated Swagger Config
import { swaggerDocs } from './docs/swagger.config';

// Route imports
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import ticketRoutes from './routes/ticket.routes';
import analyticsRoutes from './routes/analytics.routes';

import { errorHandler } from './middlewares/error.middleware';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Swagger OpenAPI Documentation ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// -------------------------------------

// Basic Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'API is running optimally' });
});

// --- Mount API Routes ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
// ------------------------

// Centralized Error Handling Middleware (Must be the last middleware)
app.use(errorHandler);

export default app;