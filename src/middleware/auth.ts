import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import User from "../models/user";

interface TokenJWT {
  _id: string;
  iat: number;
  exp: number;
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // try to get the token from the request header
    const token = req.get('Authorization')?.replace('Bearer', '').trim() as string;
    const { _id, exp } = jwt.verify(token, process.env.JWT_SECRET as string) as TokenJWT;
    const user = await User.findOne({ _id, 'tokens.token': token });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default auth;