import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as passUtil from '../../util/password';
import { generateRefreshToken, generateTokenId, generateAcceesToken, decodeToken, verifyRefreshToken } from '../../util/token';
import { AuthResponse } from './auth.dto';

export default class AuthController {
  db: PrismaClient;

  constructor(db: PrismaClient) {
    this.db = db;
  }

  signup = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const hash = await passUtil.hash(password);

    await this.db.user.create({
      data: {
        email,
        password: hash,
      },
    });

    res.sendStatus(201);
  };

  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // 1. find user from email
    const user = await this.db.user.findFirst({ where: { email } });
    if (!user) {
      res.sendStatus(404);
      return;
    }
    // 2. verify password
    const ok = await passUtil.verify(user.password, password);
    if (!ok) {
      res.sendStatus(401);
      return;
    }
    // 3. create refresh token and save to db
    const tokenId = generateTokenId();
    const refresh =
      generateRefreshToken({ sub: tokenId });
    await this.db.token.create({
      data: {
        userId: user.id,
        token: tokenId,
        expiredAt: <Date>refresh.expiredAt,
      },
    });
    // 4. create access token with user info
    const access =
      // eslint-disable-next-line prettier/prettier
      generateAcceesToken({ sub: user.id, role: user.role });
    // 5. send AuthResponse
    const authResp: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      },
      refresh: {
        token: refresh.token, expiredAt: <Date>refresh.expiredAt
      },
      access: {
        token: access.token, expiredAt: <Date>access.expiredAt
      }
    }
    res.json(authResp);
  };

  signout = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const decode = decodeToken(refreshToken);
    if (decode === null) {
      res.sendStatus(404);
      return;
    }

    await this.db.token.delete({
      where: {
        token: <string>decode.sub,
      },
    });

    res.sendStatus(204)
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
      const decode = verifyRefreshToken(refreshToken);
      const token = await this.db.token.findFirst({
        where: {
          token: <string>decode.sub,
          expiredAt: { gt: new Date() }
        },
        include: {
          user: true,
        }
      });

      if (!token) {
        return res.sendStatus(401);
      }

      const access = generateAcceesToken({ sub: token.user?.id, role: token.user?.role });

      res.json(access);

    } catch (error) {
      res.sendStatus(401);
    }
  };

  profile = async (req: Request, res: Response) => {
    const { id } = req.user
    const user = await this.db.user.findFirst({ where: { id: +id } })

    res.json({
      id: user?.id,
      email: user?.email,
      role: user?.role
    })
  };
}
