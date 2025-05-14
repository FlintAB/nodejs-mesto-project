import Joi from 'joi';
import { REGEX_URL } from '../constants/regex';

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(30),
  about: Joi.string().min(2).max(200),
  avatar: Joi.string().pattern(REGEX_URL),
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8)
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().min(8)
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  about: Joi.string().min(2).max(200).required()
});

export const updateAvatarSchema = Joi.object({
  avatar: Joi.string().required().pattern(REGEX_URL)
});

export const userIdSchema = Joi.object({
  userId: Joi.string().required().hex().length(24)
});

export const cardIdSchema = Joi.object({
  cardId: Joi.string().required().hex().length(24)
});

export const createCardSchema = Joi.object({
  name: Joi.string().required().min(2).max(30),
  link: Joi.string().required().pattern(REGEX_URL)
});
