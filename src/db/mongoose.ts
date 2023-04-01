import mongoose from "mongoose";

const connectionURL = process.env.MONGODB_URL as string;

mongoose.connect(connectionURL);

