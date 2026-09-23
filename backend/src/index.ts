import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './prisma';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    // Verify database connection
    await prisma.$connect();
    console.log('✓ Successfully connected to PostgreSQL database');

    const server = app.listen(PORT, () => {
      console.log(`✓ Editorial Blog API server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    const shutdown = async () => {
      console.log('Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('Prisma disconnected. Server terminated.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
