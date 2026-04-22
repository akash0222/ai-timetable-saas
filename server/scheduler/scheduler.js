export function generateSmartTimetable(subjects, sections, days = 5, slots = 6) {
  const timetable = {};

  sections.forEach(sec => {
    timetable[sec] = Array.from({ length: days }, () =>
      Array(slots).fill(null)
    );
  });

  let expanded = [];

  subjects.forEach(sub => {
    for (let i = 0; i < sub.Credits; i++) {
      expanded.push({
        subject: sub.Subject,
        faculty: sub.Faculty,
        priority: sub.Priority || 1
      });
    }
  });

  expanded.sort((a, b) => b.priority - a.priority);

  function isValid(sec, day, slot, sub) {
    const count = timetable[sec][day].filter(
      s => s?.subject === sub.subject
    ).length;
    if (count >= 2) return false;

    if (slot > 0) {
      const prev = timetable[sec][day][slot - 1];
      if (prev?.faculty === sub.faculty) return false;
    }

    return true;
  }

  function solve(index = 0) {
    if (index >= expanded.length) return true;

    const sub = expanded[index];

    for (let sec of sections) {
      for (let day = 0; day < days; day++) {
        for (let slot = 0; slot < slots; slot++) {

          if (timetable[sec][day][slot]) continue;
          if (!isValid(sec, day, slot, sub)) continue;

          timetable[sec][day][slot] = sub;

          if (solve(index + 1)) return true;

          timetable[sec][day][slot] = null;
        }
      }
    }

    return false;
  }

  solve();
  return timetable;
}
