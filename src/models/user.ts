import mongoose from "mongoose";

type TUser = {
  name: string,
  about: string,
  avatar: string
}

const userSchema = new mongoose.Schema<TUser>({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля name - 2'],
    maxlength: [30, 'Максимальная длина поля name - 30']
  },
  about: {
    type: String,
    required: [true, 'Поле about должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля about - 2'],
    maxlength: [200, 'Максимальная длина поля about - 200']
  },
  avatar: {
    type: String,
    required: [true, 'Поле avatar должно быть заполнено']
  }
}, { versionKey: false });

export default mongoose.model<TUser>('user', userSchema);