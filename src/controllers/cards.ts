import { NextFunction, Request, Response } from "express";
import Card from '../models/card';
import { OK_CODE, SUCCESS_CODE } from "../constants/statusCode";
import { Types } from "mongoose";
import { BadRequestError, NotFoundError, UnauthorizedError, ValidationError } from "../middlewares/errors";
import { RequestWithUser } from "../types/index";

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then(cards => res.status(OK_CODE).json(cards))
    .catch(next);
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const { name, link } = req.body;
  const owner = (req as RequestWithUser).user._id;

  if (!name || !link) throw new BadRequestError('Переданы некорректные данные при создании карточки');

  Card.create({ name, link, owner })
    .then(card => res.status(SUCCESS_CODE).json(card))
    .catch(err => {
      if (err.name === 'ValidationError') next(new ValidationError(err.errors));
      else next(err);
    });
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const cardId = req.params.cardId;

  if (!Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError('Передан некорректный _id карточки');
  }

  Card.findByIdAndDelete(cardId)
    .then(card => {
      if (!card) throw new NotFoundError('Карточка с указанным _id не найдена');
      res.status(OK_CODE).json(card);
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const userId = (req as RequestWithUser).user._id;
  const cardId = req.params.cardId;

  if (!Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError('Переданы некорректные данные для постановки лайка');
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true }
  )
    .then(card => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      res.status(OK_CODE).json(card);
    })
    .catch(next);
};

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const userId = (req as RequestWithUser).user._id;
  const cardId = req.params.cardId;

  if (!Types.ObjectId.isValid(cardId)) {
    throw new BadRequestError('Переданы некорректные данные для снятия лайка');
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true }
  )
    .then(card => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      res.status(OK_CODE).json(card);
    })
    .catch(next);
};