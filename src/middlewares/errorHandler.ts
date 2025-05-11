import { ErrorRequestHandler } from 'express';
import { AppError, ValidationError } from './errors';
import { DEFAULT_CODE } from '../constants/statusCode';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack || err.message);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      status: 'error',
      message: err.message,
      errors: err.errors
    });
  }

  const statusCode = err instanceof AppError ? err.statusCode : DEFAULT_CODE;
  const message = statusCode === DEFAULT_CODE ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};