import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
  name: String,
  hoursPerWeek: Number,
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty" }
});

export default mongoose.model("Subject", subjectSchema);