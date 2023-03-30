import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import "./db/mongoose";

import userRouter from "./routers/user";
import taskRouter from "./routers/task";

const app = express();
const port = process.env.PORT || 3000;


// parses incoming requests with JSON payloads
app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => console.log(`Server is up on port ${port}!`));