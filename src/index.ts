import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import { PrismaClient } from '@prisma/client';
import { Server } from 'http';
import { registerRoutes } from './modules/index';

const prisma = new PrismaClient();

const PORT = 8000;
const BASE_URL = '/api/v1';

async function main() {
  const app: Application = express();

  // global middlewares
  app.use(cors());
  app.use(morgan('tiny'));
  app.use(express.json());

  registerRoutes({ app, baseUrl: BASE_URL, db: prisma });

  const server = app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });

  server.on('error', async () => {
    await prisma.$disconnect();
  });

  process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    shutdown(server);
  });

  process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    shutdown(server);
  });
}

async function shutdown(server: Server) {
  server.close(async () => {
    console.log('HTTP server closed');
    // start cleanup of resource, like databases or file descriptors
    await prisma.$disconnect();
  });
}

main();
