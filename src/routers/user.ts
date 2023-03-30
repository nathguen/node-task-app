import express from "express";
import User from "../models/user";
import auth from "../middleware/auth";

const router = express.Router({ mergeParams: true, strict: true, caseSensitive: true, });

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    // @ts-ignore
    const token = user.generateAuthToken();
    res.status(201).send({ user: result, token });
    
  } catch (error) {
    // 400 is a bad request
    res.status(400).send(error);
  }
});


router.post('/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // @ts-ignore
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });

  } catch (error) {
    if (error instanceof Error) {
      res.status(400).send({ error: error.message });
    }
    res.status(500).send();
  }
});


router.patch('/users/me', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    const invalidFields = updates.filter((update) => !allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).send({ error: 'Invalid updates!', invalidFields });
    }

    const user = req.user;
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

router.get('/users/me', auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (error) {
    res.status(500).send();
  }
});


router.delete('/users/me', auth, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send();
    }

    await req.user.deleteOne();
    res.send(req.user);

  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    if (!req.user || !req.token || !req.user.tokens) {
      return res.status(401).send();
    }

    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.tokens) {
      return res.status(401).send();
    }

    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

export default router;