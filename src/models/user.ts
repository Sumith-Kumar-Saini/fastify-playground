import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  createdAt?: Date;
}

export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUserDoc>({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const createUserModel = (connection: mongoose.Connection): Model<IUserDoc> => {
  try {
    return connection.model<IUserDoc>('User');
  } catch {
    return connection.model<IUserDoc>('User', UserSchema);
  }
};
