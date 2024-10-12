import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  number: string;
  dateOfBirth?: string | null;
  address: string;
  city: string;
  zip: string;
  password: string;
  role: 'admin' | 'company' | 'user';
  refreshToken?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
}

// Create the user schema
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    number: {
      type: String,
      required: true,
      trim: true
    },
    dateOfBirth: {
      type: String,
      default: null,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    zip: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'company', 'user']
    },
    refreshToken: {
      type: String,
      default: null
    },
    resetToken: {
      type: String,
      default: null
    },
    resetTokenExpiry: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

// Create the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
