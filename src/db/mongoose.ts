import mongoose from "mongoose";

const connectionURL = process.env.MONGODB_URL;
const databaseName = "task-manager-api";

mongoose.connect(`${connectionURL}/${databaseName}`);

