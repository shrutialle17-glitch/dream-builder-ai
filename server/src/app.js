import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler.js';
import projectRoutes from './routes/project.routes.js';
import digitalTwinRoutes from './routes/digitalTwin.routes.js';

dotenv.config();

const app = express();

// Security Middleware
app.use(helmet());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

// Body and Cookie parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use(morgan('dev'));

// API Routes
app.use('/api/v1/projects', projectRoutes);
app.use('/api/v1/projects/:projectId/digital-twin', digitalTwinRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;