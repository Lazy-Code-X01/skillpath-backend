import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  _id: any;
  name: string;
  email: string;
  password?: string;
  preferences: {
    goal: string;
    currentLevel: string;
    dailyTime: number; // in minutes
  };
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    goal: { type: String, default: '' },
    currentLevel: { type: String, default: '' },
    dailyTime: { type: Number, default: 0 },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = model<IUser>('User', UserSchema);
export default User;
