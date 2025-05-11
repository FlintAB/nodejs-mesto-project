import { DEFAULT_CODE, ERROR_CODE, MISSING_CODE, OK_CODE, SUCCESS_CODE } from '../constants/statusCode';
import User from '../models/user';
import { Response, Request } from 'express';

export const getUsers = (req: Request, res: Response) => {
  return User.find({})
    .then((users) => {
      if(!users || users.length === 0){
        return res.status(MISSING_CODE).send({ message: 'Пользователи не найдены'})
      } res.status(OK_CODE).send({data: users})
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const getUserById = (req: Request, res: Response) => {
  return User.findById(req.params.userId)
    .then((user) => {
      if (!user){
        return res.status(MISSING_CODE).send({ message: 'Пользователь не найден'})
      } res.status(OK_CODE).send({data: user})
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const createUser = (req: Request, res: Response) => {
  const {name, about, avatar} = req.body;

  if (!name || !about || !avatar){
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя'})
  }

  return User.create({name, about, avatar})
    .then((user) => res.status(SUCCESS_CODE).send({ data: user}))
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const updateUser = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const userId = req.user._id;
  const {name, about} = req.body;

  if (!name || !about){
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя'})
  }

  return User.findByIdAndUpdate(userId, {name, about}, {new: true})
    .then((user) => {
      if (!user){
        return res.status(MISSING_CODE).send({ message: 'Пользователь не найден'})
      }
      res.status(OK_CODE).send({data: user})
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const updateUserAvatar = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const userId = req.user._id;
  const {avatar} = req.body;

  if (!avatar){
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя'})
  }

  return User.findByIdAndUpdate(userId, {avatar}, {new: true})
    .then((user) => {
      if (!user){
        return res.status(MISSING_CODE).send({ message: 'Пользователь не найден'})
      }
      res.status(OK_CODE).send({ data: user})
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
}