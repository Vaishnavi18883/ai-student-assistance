import mongoose from "mongoose";

const learnerSchema = new mongoose.Schema({

  learnerId: {
    type: String,
    required: true,
    unique: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String  // ✅ ADDED
  },

  rollNo: {
    type: String,
    required: true,
    unique: true
  },

  course: {
    type: String,
    required: true
  },

  department: {
    type: String
  },

  semester: {
    type: String
  },

  phone: {
    type: String
  }

}, {
  timestamps: true
});

const Learner = mongoose.model("Learner", learnerSchema);

export default Learner;