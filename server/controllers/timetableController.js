import Timetable from "../models/Timetable.js";

export const generateTimetable = async (req, res) => {
  const { subjects, slots } = req.body;

  let timetable = {};

  for (let slot of slots) {
    for (let subject of subjects) {
      if (!timetable[slot]) {
        timetable[slot] = subject.name;
        break;
      }
    }
  }

  const saved = await Timetable.create({
    slots,
    generatedData: timetable
  });

  res.json(saved);
};