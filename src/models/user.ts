import bcrypt from "bcrypt";
import mongoose, { Model } from "mongoose";
import isEmail from "validator/lib/isEmail";
import jwt from "jsonwebtoken";

interface UserDocument extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  age: number;
  tokens: { token: string }[];
}

interface UserModel extends Model<UserDocument> {
  findByCredentials(email: string, password: string): Promise<UserDocument | null>;
}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
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
  tokens: [{
    token: {
      type: String,
      required: true,
    },
  }] 
});


// adds a method the user instance
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString(), }, process.env.JWT_SECRET as string, { expiresIn: '24h' });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};


// adds a method to the User model
userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};


userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});


const User = mongoose.model("User", userSchema);

export default User;