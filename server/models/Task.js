import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: 150
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: ""
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo"
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium"
    },

    dueDate: {
      type: Date,
      default: null
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for task filtering
taskSchema.index({
  owner: 1,
  project: 1,
  status: 1,
  priority: 1,
  createdAt: -1
});

const Task = mongoose.model("Task", taskSchema);

export default Task;