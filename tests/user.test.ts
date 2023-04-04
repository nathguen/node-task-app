import { beforeEach, expect, test } from '@jest/globals';
import sendgrid from '@sendgrid/mail';
import request from 'supertest';

import app from '../src/app';
import User from '../src/models/user';
import { User as IUser } from '../src/types/user';
import { setupDatabase, userTwoToken, userTwo, userTwoId } from './fixtures/db';



beforeEach(setupDatabase);

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

  // Assert that the email was sent
  expect(sendgrid.send).toHaveBeenCalled();
});

test('Should login existing user', async () => {
  const resp = await request(app)
    .post('/users/login')
    .send({
      email: userTwo.email,
      password: userTwo.password,
    })
    .expect(200);

  expect(resp.body).toMatchObject({
    user: {
      name: userTwo.name,
      email: userTwo.email,
      age: userTwo.age,
    },
  });

  expect(resp.body.token).toBeTruthy();
});

test('Should not login nonexistent user', async () => {
  await request(app)
    .post('/users/login')
    .send({
      email: userTwo.email,
      password: 'wrongPassword',
    })
    .expect(400);
});

test('Should get profile for user', async () => {
  await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userTwoToken}`)
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
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send()
    .expect(200);

  // Assert that user no longer exists
  const user = await User.findOne({ email: userTwo.email });
  expect(user).toBeNull();

  // Assert that the email was sent
  expect(sendgrid.send).toHaveBeenCalled();
});

test('Should not delete account for unauthenticated user', async () => {
  await request(app)
    .delete('/users/me')
    .send()
    .expect(401);
});

test('Should upload avatar image', async () => {
  await request(app)
    .post('/users/me/avatar')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .attach('avatar', 'tests/fixtures/profile-pic.jpg')
    .expect(201);

  const user = await User.findById(userTwoId);
  expect(user?.avatar).toEqual(expect.any(Buffer));
});

test('Should update valid user fields', async () => {
  const resp = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send({
      name: 'Nate',
      age: 42,
    })
    .expect(200);

  // Assert that the user was updated correctly
  expect(resp.body).toMatchObject({
    name: 'Nate',
    age: 42,
  });
});

test('Should not update invalid user fields', async () => {
  await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send({
      location: 'New York',
    })
    .expect(400);
});