import app from './app.js';
import dotenv from 'dotenv';
import prisma from './lib/prisma.js';

dotenv.config();

// Environment variables validation
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`FATAL ERROR: ${envVar} is not defined in environment variables.`);
    process.exit(1);
  }
}

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt DB connection
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (dbError) {
    console.error('Database connection failed (expected during scaffolding without local Postgres):', dbError.message);
  }

  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
