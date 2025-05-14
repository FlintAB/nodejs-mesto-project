import { AlreadyExistError, NotFoundError, UnauthorizedError } from '../middlewares/errors';
import { OK_CODE, SUCCESS_CODE } from '../constants/statusCode';
import User from '../models/user';
import { Response, Request, NextFunction } from 'express';
import { RequestWithUser } from '../types/index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({ name, about, avatar, email, password: hash }))
    .then(user => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(SUCCESS_CODE).json(userWithoutPassword);
    })
    .catch(err => {
      if (err.code === 11000) {
        next(new AlreadyExistError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

export const updateUser = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const { name, about } = req.body;

  User.findByIdAndUpdate(
    (req as RequestWithUser).user._id,
    { name, about },
    { new: true }
  )
    .then(user => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.status(OK_CODE).json(user);
    })
    .catch(next);
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const { avatar } = req.body;

  User.findByIdAndUpdate(
    (req as RequestWithUser).user._id,
    { avatar },
    { new: true }
  )
    .then(user => {
      if (!user) throw new NotFoundError('Пользователь не найден');
      res.status(OK_CODE).json(user);
    })
    .catch(next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then(user => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_DEV || 'dev-key', { expiresIn: '7d' }
      );

      res.cookie('jwt', token, {httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production'});

      res.send({ token, message: 'Авторизация прошла успешно' });
    })
    .catch(next);
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  User.findById((req as RequestWithUser).user._id)
    .then(user => {
      if (!user) throw new NotFoundError('Пользователь не найден');

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      res.status(OK_CODE).json(userWithoutPassword);
    })
    .catch(next);
};