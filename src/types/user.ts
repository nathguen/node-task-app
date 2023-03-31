import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: { token: string }[];
  generateAuthToken(): Promise<string>;
  // tasks only used for mongoose queries
  tasks?: mongoose.Schema.Types.ObjectId[];
}
