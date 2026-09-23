import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { prisma } from './prisma';
import { seedInitialData } from './utils/seedData';
import { execSync } from 'child_process';

const PORT = parseInt(process.env.PORT || '5000', 10);

async function startServer() {
  try {
    // 1. Automatically push database schema if needed
    try {
      console.log('Synchronizing database schema with Prisma...');
      execSync('npx prisma db push --accept-data-loss --skip-generate', { stdio: 'inherit' });
      console.log('✓ Database schema synchronized');
    } catch (pushErr) {
      console.warn('Prisma schema push warning:', pushErr);
    }

    // 2. Verify database connection
    await prisma.$connect();
    console.log('✓ Successfully connected to PostgreSQL database');

    // 3. Seed demo content if database is empty
    try {
      await seedInitialData(prisma);
    } catch (seedErr) {
      console.warn('Auto-seed warning:', seedErr);
    }

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
