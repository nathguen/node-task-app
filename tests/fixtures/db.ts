import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Task, { TaskDocument } from '../../src/models/task';
import User from '../../src/models/user';
import { UserDocument } from '../../src/types/user';

export const userOneId = new mongoose.Types.ObjectId();
export const userOneToken = jwt.sign({ _id: userOneId }, process.env.JWT_SECRET as string);
export const userOne: UserDocument = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@test.com',
  password: 'MyPass777!',
  age: 21,
  tokens: [{
    token: userOneToken,
  }]
} as UserDocument;

export const userTwoId = new mongoose.Types.ObjectId();
export const userTwoToken = jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET as string);
export const userTwo: UserDocument = {
  _id: userTwoId,
  name: 'Johnny',
  email: 'johnny@test.com',
  password: 'MyPass12777!',
  age: 21,
  tokens: [{
    token: userTwoToken,
  }]
} as UserDocument;

export const taskOne: TaskDocument = {
  _id: new mongoose.Types.ObjectId(),
  description: 'First task',
  completed: false,
  owner: userOneId._id,
} as TaskDocument;

export const taskTwo: TaskDocument = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Second task',
  completed: false,
  owner: userTwoId._id,
} as TaskDocument;

export const taskThree: TaskDocument = {
  _id: new mongoose.Types.ObjectId(),
  description: 'Third task',
  completed: true,
  owner: userTwoId._id,
} as TaskDocument;

export const setupDatabase = async () => {
    // reset the DB
    await User.deleteMany({});
    await Task.deleteMany({});

    // establish a base user
    await new User(userOne).save();

    // establish a second user
    await new User(userTwo).save();

    // establish a base task
    await new Task(taskOne).save();

    // establish a second task
    await new Task(taskTwo).save();

    // establish a third task
    await new Task(taskThree).save();
};