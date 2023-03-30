import express from "express";
import auth from "../middleware/auth";
import Task from "../models/task";

const router = express.Router({ mergeParams: true, strict: true, caseSensitive: true, });

router.post('/tasks', auth, async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      owner: req.user?._id,
    });
    const result = await task.save();
    res.status(201).send(result);

  } catch (error) {
    // 400 is a bad request
    res.status(400).send(error);
  }
});

router.get('/tasks', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user?._id });
    res.send(tasks);
  } catch (error) {
    res.status(500).send();
  }
});

router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user?._id });
    
    if (!task) {
      return res.status(404).send();
    }

    res.send(task);
  } catch (error) {
    res.status(500).send();
  }
});

router.patch('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const invalidFields = updates.filter((update) => !allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!', invalidFields });
    }

    const task = await Task.findOne({ _id, owner: req.user?._id });
    if (!task) {
      return res.status(404).send();
    }

    // update each field on task
    // @ts-ignore
    updates.forEach((update) => task[update] = req.body[update]);
    await task.save();
    res.send(task);

  } catch (error) {
    res.status(500).send();
  }
});

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const deletedTask = await Task.findOneAndDelete({ _id, owner: req.user?._id });

    if (!deletedTask) {
      return res.status(404).send();
    }

    res.send(deletedTask);
  } catch (error) {
    res.status(500).send();
  }
});

export default router;