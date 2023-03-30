import bcrypt from "bcrypt";
import express from "express";
import User from "../models/user";

const router = express.Router({ mergeParams: true, strict: true, caseSensitive: true, });

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    res.status(201).send(result);
    
  } catch (error) {
    // 400 is a bad request
    res.status(400).send(error);
  }
});


router.patch('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const invalidFields = updates.filter((update) => !allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!', invalidFields });
    }

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }

    // update each field on user
    // @ts-ignore
    updates.forEach((update) => user[update] = req.body[update]);
    await user.save();

    res.send(user);

  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/users/:id', async (req, res) => {
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


router.delete('/users/:id', async (req, res) => {
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

export default router;