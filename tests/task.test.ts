import { beforeEach, expect, test } from '@jest/globals';
import request from 'supertest';

import app from '../src/app';
import Task from '../src/models/task';

import { setupDatabase, taskTwo, userOneToken, userTwoId, userTwoToken } from './fixtures/db';

beforeEach(setupDatabase);

test('Should create task for user', async () => {
  const resp = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send({
      description: 'From my test',
    })
    .expect(201);

  const savedTask = await Task.findById(resp.body._id);
  expect(savedTask).not.toBeNull();

  expect(resp.body).toMatchObject({
    description: 'From my test',
    completed: false,
    owner: userTwoId.toString(),
  });
});

test('Should update task for user', async () => {
  const resp = await request(app)
    .patch(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send({
      description: 'Updated task',
      completed: true,
    })
    .expect(200);

  expect(resp.body).toMatchObject({
    description: 'Updated task',
    completed: true,
  });
});

test('Should not update other users task', async () => {
  await request(app)
    .patch(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userOneToken}`)
    .send({
      description: 'Updated task',
      completed: true,
    })
    .expect(404);
});

test('Should get task data for task id', async () => {
  const resp = await request(app)
    .get(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send()
    .expect(200);

  expect(resp.body).toMatchObject({
    description: taskTwo.description,
    completed: taskTwo.completed,
  });
});

test('Should not get task data for task id if unauthenticated', async () => {
  await request(app)
    .get(`/tasks/${taskTwo._id}`)
    .send()
    .expect(401);
});

test('Should not get task data for non-owner user', async () => {
  await request(app)
    .get(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userOneToken}`)
    .send()
    .expect(404);
});

test('Should get all tasks for user', async () => {
  const resp = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send()
    .expect(200);

  expect(resp.body.length).toEqual(2);
});

test('Should not delete other users tasks', async () => {
  await request(app)
    .delete(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userOneToken}`)
    .expect(404)
});

test('Should delete user task', async () => {
  await request(app)
    .delete(`/tasks/${taskTwo._id}`)
    .set('Authorization', `Bearer ${userTwoToken}`)
    .expect(204);
});

test('Should not delete task if unauthenticated', async () => {
  await request(app)
    .delete(`/tasks/${taskTwo._id}`)
    .expect(401);
});

test('Should get all completed tasks for user', async () => {
  const resp = await request(app)
    .get('/tasks?completed=true')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send()
    .expect(200);

  expect(resp.body.length).toEqual(1);
});

test('Should get all incomplete tasks for user', async () => {
  const resp = await request(app)
    .get('/tasks?completed=false')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send()
    .expect(200);

  expect(resp.body.length).toEqual(1);
});

test('Should get all tasks sorted by description', async () => {
  const resp = await request(app)
    .get('/tasks?sortBy=description:asc')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send()
    .expect(200);

  expect(resp.body[0].description).toEqual('Second task');

  const resp2 = await request(app)
    .get('/tasks?sortBy=description:desc')
    .set('Authorization', `Bearer ${userTwoToken}`)
    .send()
    .expect(200);

  expect(resp2.body[0].description).toEqual('Third task');
});