import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiry?: Date;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId:     { type: String, required: true, unique: true, index: true },
    email:        { type: String, required: true, unique: true },
    name:         { type: String, required: true },
    picture:      { type: String, default: "" },
    accessToken:  { type: String, required: true },
    refreshToken: { type: String, required: true },
    tokenExpiry:  { type: Date },
    lastLogin:    { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", UserSchema);
