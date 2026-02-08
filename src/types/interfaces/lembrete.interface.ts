import type { Types } from "mongoose";

export interface ILembrete extends Document {
  userId: Types.ObjectId;
  taskId: Types.ObjectId;

  remindAt: Date;
  sent: boolean;
  sentAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}