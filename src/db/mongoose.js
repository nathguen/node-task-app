const mongoose = require("mongoose");

const connectionURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const databaseName = "task-manager-api";

mongoose.connect(`${connectionURL}/${databaseName}`);

