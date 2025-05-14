import bcrypt from "bcryptjs/umd/types";
import mongoose from "mongoose";
import validator from 'validator';

interface IUser  {
  name: string,
  about: string,
  avatar: string,
  email: string,
  password?: string
}

interface IUserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<mongoose.Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля name - 2'],
    maxlength: [30, 'Максимальная длина поля name - 30'],
    default: 'Жак-Ив Кусто'
  },
  about: {
    type: String,
    minlength: [2, 'Минимальная длина поля about - 2'],
    maxlength: [200, 'Максимальная длина поля about - 200'],
    default: 'Исследователь'
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value: string) => validator.isURL(value),
      message: 'Некорректный URL'
    },
  },
  email: {
    type: String,
    required: [true, 'Поле email должно быть заполнено'],
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Неккоректный email'
    }
  },
  password: {
    type: String,
    required: [true, 'Поле password должно быть заполнено'],
    select: false
  }
}, { versionKey: false });


userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string){
  return this.findOne({ email }).select('+password')
    .then((user: { password: string; }) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
    return bcrypt.compare(password, user.password)
      .then((matched) => {
        if (!matched){
          return Promise.reject(new Error('Неправильные почта или пароль'));
        }
        return user;
        })
    })
});


export default mongoose.model<IUser, IUserModel>('user', userSchema);