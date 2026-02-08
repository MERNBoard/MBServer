import type { Types } from "mongoose";

export interface INotificacao extends Document {
  userId: Types.ObjectId;

  title: string;
  message: string;

  read: boolean;
  readAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}