import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";

const { PORT = 3000 } = process.env;
const app = express();

app.use((req: Request, res: Response, next: NextFunction) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.user = {
    _id: '681f8ccfa751f94283ca3487'
  };

  next();
});


mongoose.connect('mongodb://localhost:27017/mestodb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/users', userRouter);
app.use('/cards', cardRouter);


app.listen(+PORT, () => {
    console.log(`App listening on port ${PORT}`);
});