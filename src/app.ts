import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import {apiLimiter} from './middlewares/rateLimit';
import { createUser, login } from "controllers/users";
import cookieParser from "cookie-parser";
import auth from './middlewares/auth';
import { requestLogger, errorLogger } from "middlewares/logger";
import { celebrate, errors } from "celebrate";
import { createUserSchema, loginSchema } from "middlewares/validators";


const { PORT = 3000 } = process.env;
const app = express();

app.use(apiLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);

app.post('/signin', celebrate({body: loginSchema}) ,login);
app.post('/signup', celebrate({body: createUserSchema}) ,createUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);
app.use(errors());

// Обработка несуществующего роута
app.use('*',notFoundHandler);
// Централизованная обработка ошибок
app.use(errorHandler);


mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(+PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  })
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));