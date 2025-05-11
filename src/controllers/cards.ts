import { Request, Response } from "express";
import Card from '../models/card';
import { DEFAULT_CODE, ERROR_CODE, MISSING_CODE, OK_CODE, SUCCESS_CODE } from "../constants/statusCode";
import { Types } from "mongoose";


export const getCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => res.status(OK_CODE).send({ data: cards}))
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const createCard = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const owner = req.user._id;;
  const {name, link} = req.body;

  if(!name || !link){
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки'})
  }

  return Card.create({name, link, owner})
    .then((card) => res.status(SUCCESS_CODE).send({ data: card}))
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const deleteCard = (req: Request, res: Response) => {

  if(!Types.ObjectId.isValid){
    return res.status(ERROR_CODE).send({ message: 'Передан некорректный _id карточки'})
  }

  return Card.findByIdAndDelete(req.params._id)
    .then((card) => {
      if(!card){
        return res.status(MISSING_CODE).send({ message: 'Карточка с указанным _id не найдена'})
      }
      res.status(OK_CODE).send({ data: card})
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const likeCard = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const userId = req.user._id;

  if(!Types.ObjectId.isValid){
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка или некорректный _id карточки'})
  }

  return Card.findByIdAndUpdate(req.params.cardId, {$addToSet: {likes: userId}}, {new: true})
    .then((card) => {
      if(!card){
        return res.status(MISSING_CODE).send({ message: 'Передан несуществующий _id карточки'})
      }
      res.status(OK_CODE).send({ data: card})
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
};

export const dislikeCard = (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const userId = req.user._id;

  if(!Types.ObjectId.isValid){
    return res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка или некорректный _id карточки'})
  }

  return Card.findByIdAndUpdate(req.params.cardId, {$pull: {likes: userId}}, {new: true})
    .then((card) => {
      if (!card){
        return res.status(MISSING_CODE).send({ message: 'Передан несуществующий _id карточки'})
      }
      res.status(OK_CODE).send({ data: card})
    })
    .catch(() => res.status(DEFAULT_CODE).send({ message: 'Ошибка сервера'}))
}