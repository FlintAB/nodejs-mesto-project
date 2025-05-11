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
    required: true,
    minlength: 2,
    maxlength: 30
  },
  link: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<TCard>('card', cardSchema)