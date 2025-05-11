import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Слишком много запросов, попробуйте позже'
  },
  skip: (req) => {
    return process.env.NODE_ENV === 'development';
  }
});