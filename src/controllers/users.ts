import { BadRequestError, NotFoundError, UnauthorizedError, ValidationError } from '../middlewares/errors';
import { OK_CODE, SUCCESS_CODE } from '../constants/statusCode';
import User from '../models/user';
import { Response, Request, NextFunction } from 'express';
import { RequestWithUser } from '../types/index';

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then(users => {
      if (!users || users.length === 0) throw new NotFoundError('Пользователи не найдены');
      res.status(OK_CODE).json(users);
    })
    .catch(next);
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.status(OK_CODE).json(user);
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) throw new BadRequestError('Переданы некорректные данные при создании пользователя');

  User.create({ name, about, avatar })
    .then(user => res.status(SUCCESS_CODE).json(user))
    .catch(err => {
      if (err.name === 'ValidationError') next(new ValidationError(err.errors));
      else next(err);
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const { name, about } = req.body;

  if (!name || !about) throw new BadRequestError('Переданы некорректные данные при обновлении пользователя');

  User.findByIdAndUpdate(
    (req as RequestWithUser).user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.status(OK_CODE).json(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') next(new ValidationError(err.errors));
      else next(err);
    });
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const { avatar } = req.body;

  if (!avatar) throw new BadRequestError('Переданы некорректные данные при обновлении аватара');

  User.findByIdAndUpdate(
    (req as RequestWithUser).user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then(user => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.status(OK_CODE).json(user);
    })
    .catch(err => {
      if (err.name === 'ValidationError') next(new ValidationError(err.errors));
      else next(err);
    });
};