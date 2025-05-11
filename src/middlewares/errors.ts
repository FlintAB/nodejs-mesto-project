import { DEFAULT_CODE, ERROR_CODE, MISSING_CODE, UNAUTHORIZED_CODE } from "../constants/statusCode";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Переданы некорректные данные') {
    super(message, ERROR_CODE);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Необходима авторизация') {
    super(message, UNAUTHORIZED_CODE);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ресурс не найден') {
    super(message, MISSING_CODE);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Ошибка сервера') {
    super(message, DEFAULT_CODE);
  }
}

export class ValidationError extends AppError {
  errors: string[];

  constructor(errors: Record<string, { message: string }>) {
    const messages = Object.values(errors).map(e => e.message);
    super(`Ошибка валидации: ${messages.join(', ')}`, 400);
    this.errors = messages;
  }
}