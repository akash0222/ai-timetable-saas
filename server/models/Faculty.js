import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
  name: String,
  availability: [String]
});

export default mongoose.model("Faculty", facultySchema);