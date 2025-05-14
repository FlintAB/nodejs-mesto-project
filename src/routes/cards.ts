import { Router } from "express";
import { createCard, deleteCard, getCards, likeCard, dislikeCard } from "../controllers/cards";
import { cardIdSchema, createCardSchema } from '../middlewares/validators';
import { celebrate } from "celebrate";


const router = Router();

router.get('/', getCards);

router.post('/', celebrate({body: createCardSchema}), createCard);

router.delete('/:cardId', celebrate({params: cardIdSchema}), deleteCard);

router.put('/:cardId/likes', celebrate({params: cardIdSchema}), likeCard);

router.delete('/:cardId/likes', celebrate({params: cardIdSchema}), dislikeCard);

export default router;