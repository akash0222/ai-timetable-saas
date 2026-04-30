export const generateTimetable = (subjects, teachers, slots) => {
  let timetable = [];
  let index = 0;

  for (let day = 0; day < 5; day++) {
    let daySchedule = [];

    for (let slot of slots) {
      daySchedule.push({
        slot,
        subject: subjects[index % subjects.length],
        teacher: teachers[index % teachers.length],
      });

      index++;
    }

    timetable.push(daySchedule);
  }

  return timetable;
};