import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../util/token';

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header('Authorization')?.split(' ');
  // 'Access denied. No token provided.'
  if (!authorization) return res.sendStatus(401);
  // 'Access denied. Invalid token.'
  if (authorization[0] !== 'Bearer') return res.sendStatus(401);

  try {
    const decoded = verifyAccessToken(authorization[1]);
    // eslint-disable-next-line prettier/prettier
    const { sub: id, role } = decoded as {
      sub: string;
      role: string;
    };
    req.user = { id, role };
    next();
  } catch (ex) {
    // 'Access denied. Invalid token.'
    res.sendStatus(401);
  }
};
