import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  subject: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  fileUrl: {
    type: String,
    required: true
  },

  studentId: {
    type: String,
    required: true
  }

}, { timestamps: true });

const StudyMaterial = mongoose.model(
  "StudyMaterial",
  studyMaterialSchema
);

export default StudyMaterial;