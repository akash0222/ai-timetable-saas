import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  slots: Array,
  generatedData: Object
});

export default mongoose.model("Timetable", timetableSchema);