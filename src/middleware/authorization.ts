import { Request, Response, NextFunction } from 'express';

export const authorization = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== 'admin') {
    return res.sendStatus(403);
  }
  next();
};
