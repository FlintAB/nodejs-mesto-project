import { NextFunction, Request, Response } from "express";
import Card from '../models/card';
import { OK_CODE, SUCCESS_CODE } from "../constants/statusCode";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "../middlewares/errors";
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

  Card.create({ name, link, owner })
    .then(card => res.status(SUCCESS_CODE).json(card))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) {
    return next(new UnauthorizedError('Пользователь не авторизован'));
  }

  const { cardId } = req.params;
  const userId = (req as RequestWithUser).user._id;

  Card.findById(cardId)
    .then(card => {
      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена'));
      }

      if (card.owner.toString() !== userId.toString()) {
        return next(new ForbiddenError('Нельзя удалять чужие карточки'));
      }

      return Card.findByIdAndDelete(cardId)
        .then(deletedCard => {
          res.status(OK_CODE).json(deletedCard);
        });
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  if (!(req as RequestWithUser).user) throw new UnauthorizedError('Пользователь не авторизован');

  const userId = (req as RequestWithUser).user._id;
  const cardId = req.params.cardId;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
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

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then(card => {
      if (!card) throw new NotFoundError('Карточка не найдена');
      res.status(OK_CODE).json(card);
    })
    .catch(next);
};