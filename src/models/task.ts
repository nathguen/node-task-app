import mongoose, { Schema } from "mongoose";

export interface TaskDocument extends mongoose.Document {
  description: string;
  completed: boolean;
  owner: mongoose.Schema.Types.ObjectId;
}

const taskSchema = new Schema<TaskDocument>({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
}, {
  timestamps: true,
});

const Task = mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;