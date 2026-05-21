import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  deadline: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Pending"
  },

  learnerId: {
    type: String  
  }

}, {
  timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;