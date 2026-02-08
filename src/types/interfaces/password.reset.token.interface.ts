import type { Types } from 'mongoose';

export interface IPasswordResetToken extends Document {
  userId: Types.ObjectId;

  tokenHash: string;
  expiresAt: Date;

  used: boolean;
  usedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}
