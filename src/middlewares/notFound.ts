import { NextFunction, Request, Response } from 'express';
import { NotFoundError } from './errors';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
};