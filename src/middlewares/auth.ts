import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RequestWithUser } from '../types/index';
import { UnauthorizedError } from './errors';

const auth = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET_DEV || 'dev-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
    return;
  }

  (req as RequestWithUser).user = payload as { _id: string };

  next();
};

export default auth;