import { generateTimetable } from "../services/timetableService.js";

export const createTimetable = (req, res) => {
  try {
    const { subjects, teachers, slots } = req.body;

    const timetable = generateTimetable(subjects, teachers, slots);

    res.json(timetable);
  } catch (err) {
    res.status(500).json(err.message);
  }
};