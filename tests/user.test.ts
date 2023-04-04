import { beforeEach, afterEach, jest, test, expect } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import app from '../src/app';
import User from '../src/models/user';
import { User as IUser, UserDocument } from '../src/types/user';


const userOneId = new mongoose.Types.ObjectId();
const token = jwt.sign({ _id: userOneId }, process.env.JWT_SECRET as string);
const userOne: UserDocument = {
  _id: userOneId,
  name: 'Mike',
  email: 'mike@test.com',
  password: 'MyPass777!',
  age: 21,
  tokens: [{
    token,
  }]
} as UserDocument;

beforeEach(async () => {
  // reset the DB
  await User.deleteMany({});
  // establish a base user
  await new User(userOne).save();
});

test('Should sign up a new user', async () => {
  const user: IUser = {
    name: 'Nate',
    email: 'nathan@test.com',
    password: 'MyPass777!',
    age: 20,
  };

  const resp = await request(app)
    .post('/users')
    .send(user)
    .expect(201);

  // Assert that the database was changed correctly
  const savedUser = await User.findById(resp.body.user._id);
  expect(savedUser).not.toBeNull();

  // Assertions about the response
  expect(resp.body).toMatchObject({
    user: {
      name: user.name,
      email: user.email,
    },
    token: savedUser?.tokens[0].token,
  });

  // Assert that the password is not stored as plain text
  expect(savedUser?.password).not.toBe(user.password);
});

test('Should login existing user', async () => {
  const resp = await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  expect(resp.body).toMatchObject({
    user: {
      name: userOne.name,
      email: userOne.email,
      age: userOne.age,
    },
  });

  expect(resp.body.token).toBeTruthy();
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userOne.email,
      password: 'wrongPassword',
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(200);
});

test('Should not get profile for unauthenticated user', async () => {
  await request(app)
    .get('/users/me')
    .send()
    .expect(401);
});

test('Should delete account for user', async () => {
  await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(200);

  // Assert that user no longer exists
  const user = await User.findOne({ email: userOne.email });
  expect(user).toBeNull();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});