import { Application, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as authModule from './auth';
import * as userModule from './users';

export interface RouterConfig {
  app: Application;
  baseUrl: string;
  db: PrismaClient;
}

export const registerRoutes = (cfg: RouterConfig) => {
  cfg.app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Auth Server');
  });

  authModule.registerRoutes(cfg);
  userModule.registerRoutes(cfg);
};
