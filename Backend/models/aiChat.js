import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({

  learnerId: {
    type: String
  },

  question: {
    type: String,
    required: true
  },

  answer: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;  