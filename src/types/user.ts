import mongoose from "mongoose";

export interface User {
  name: string;
  email: string;
  password: string;
  age: number;
}

export interface UserDocument extends mongoose.Document, User {
  tokens: { token: string }[];
  generateAuthToken(): Promise<string>;
  // tasks only used for mongoose queries
  tasks?: mongoose.Schema.Types.ObjectId[];
  avatar?: Buffer;
}
