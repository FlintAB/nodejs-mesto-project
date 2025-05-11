import mongoose, { Schema, Types } from "mongoose";

type TCard = {
  name: string,
  link: string,
  owner: Types.ObjectId,
  likes: Types.ObjectId[],
  createdAt: Date
}

const cardSchema = new mongoose.Schema<TCard>({
  name: {
    type: String,
    required: [true, 'Поле name должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля name - 2'],
    maxlength: [30, 'Максимальная длина поля name - 30']
  },
  link: {
    type: String,
    required: [true, 'Поле link должно быть заполнено']
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'ПОле owner должно быть заполнено'],
    ref: 'user'
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false });

export default mongoose.model<TCard>('card', cardSchema)