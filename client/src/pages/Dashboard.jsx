import { useState } from "react";
import API from "../api/api";

export default function Dashboard() {
  const [data, setData] = useState([]);

  const generate = async () => {
    const res = await API.post("/timetable/generate", {
      subjects: ["Math", "AI", "DBMS"],
      teachers: ["A", "B", "C"],
      slots: ["9AM", "10AM", "11AM"],
    });

    setData(res.data);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={generate}>Generate Timetable</button>

      {data.map((day, i) => (
        <div key={i}>
          <h3>Day {i + 1}</h3>
          {day.map((s, j) => (
            <p key={j}>
              {s.slot} - {s.subject} ({s.teacher})
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}