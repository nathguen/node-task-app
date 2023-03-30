import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import "./db/mongoose";

import User from "./models/user";
import Task from "./models/task";

const app = express();
const port = process.env.PORT || 3000;

// parses incoming requests with JSON payloads
app.use(express.json());

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.status(201).send(result);
    
  } catch (error) {
    // 400 is a bad request
    res.status(400).send(error);
  }
});

app.get('/usersss', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send();
  }
});

app.patch('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const invalidFields = updates.filter((update) => !allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!', invalidFields });
    }

    const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);

  } catch (error) {
    res.status(500).send();
  }
});

app.delete('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(_id);

    if (!deletedUser) {
      return res.status(404).send();
    }

    res.send(deletedUser);

  } catch (error) {
    res.status(500).send();
  }

});

app.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    const result = await task.save();
    res.status(201).send(result);

  } catch (error) {
    // 400 is a bad request
    res.status(400).send(error);
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);
    
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const invalidFields = updates.filter((update) => !allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!', invalidFields });
    }

    const updatedTask = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

    if (!updatedTask) {
      return res.status(404).send();
    }

    res.send(updatedTask);

  } catch (error) {
    res.status(500).send();
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(_id);

    if (!deletedTask) {
      return res.status(404).send();
    }

    res.send(deletedTask);
  } catch (error) {
    res.status(500).send();
  }
});

app.listen(port, () => console.log(`Server is up on port ${port}!`));