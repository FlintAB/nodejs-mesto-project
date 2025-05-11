import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import { AppError } from "../src/middlewares/errors";
import { DEFAULT_CODE } from "../src/constants/statusCode";
import { RequestWithUser } from "./types/index";


const { PORT = 3000 } = process.env;

const app = express();
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


app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {

  console.error(err.stack || err.message);

  const statusCode = err instanceof AppError ? err.statusCode : DEFAULT_CODE;
  const message = statusCode === DEFAULT_CODE ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).json({
    message,
    status: 'error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(+PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  })
  .catch(err => console.error('Ошибка подключения к MongoDB:', err));