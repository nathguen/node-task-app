import mongoose, { Schema } from "mongoose";

interface TaskDocument extends mongoose.Document {
  description: string;
  completed: boolean;
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
});

const Task = mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;