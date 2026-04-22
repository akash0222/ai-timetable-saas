import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
  data: { type: Object, required: true },
  userId: Number,
  createdAt: { type: Date, default: Date.now }
});

const Timetable = mongoose.model("Timetable", timetableSchema);

export default Timetable;