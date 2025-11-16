import mongoose, { Document, model, Schema, Types } from 'mongoose';

export interface IUser extends Document<Types.ObjectId> {
  name: string;
  email: string;
}

const UserSchema = new Schema<IUser>({
  name: String,
  email: String,
});

export const User = mongoose.models.User || model<IUser>('User', UserSchema);
