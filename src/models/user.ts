import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail";

interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
}

const userSchema = new mongoose.Schema<UserDocument>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (value: string) => {
        if (!value.includes("@")) {
          throw new Error("Email must contain @");
        }
        if (!isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 7,
    validate: {
      validator: (value: string) => {
        if (value.toLowerCase().includes("password")) {
          throw new Error("Password cannot contain 'password'");
        }
      },
    },
  },
  age: {
    type: Number,
    default: 0,
    validate: {
      validator: (value: number) => {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;