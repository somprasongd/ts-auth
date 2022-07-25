import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

export default class UserController {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  create = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    await this.db.user.create({
      data: { email, password, role },
    });

    res.sendStatus(201);
  };

  list = async (req: Request, res: Response) => {
    const users = await this.db.user.findMany();

    const serailizeUsers = users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    });

    res.json(serailizeUsers);
  };
}
