"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectionURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";
const databaseName = "task-manager-api";
mongoose_1.default.connect(`${connectionURL}/${databaseName}`);
