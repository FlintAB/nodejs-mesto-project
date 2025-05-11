import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import { RequestWithUser } from "./types/index";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFound";
import {apiLimiter} from './middlewares/rateLimit';


const { PORT = 3000 } = process.env;
const app = express();

app.use(apiLimiter);

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  (req as RequestWithUser).user = {
    _id: '680f60cb68fe08b9c8d744f9',
  };

  next();
});


app.use(express.urlencoded({ extended: true }));


app.use('/users', userRouter);
app.use('/cards', cardRouter);


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