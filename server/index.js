import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import xlsx from "xlsx";
import jwt from "jsonwebtoken";
import Timetable from "./models/Timetable.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

/* ✅ Ensure uploads folder exists */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/* ✅ MongoDB Connection */
mongoose.set("strictQuery", true);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

/* ✅ Multer Setup */
const upload = multer({ dest: "uploads/" });

/* ✅ Login Route */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, role: user.role });
});

  const token = jwt.sign(
    { userId: "1" },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });


/* ✅ Upload Excel */
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const wb = xlsx.readFile(req.file.path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ Simple Timetable Generator */
app.post("/generate", authMiddleware, async (req, res) => {
  try {
    const subjects = req.body.data;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
    const slots = ["S1", "S2", "S3", "S4"];

    let timetable = {};

    days.forEach(day => {
      timetable[day] = {};
      slots.forEach(slot => {
        const random = subjects[Math.floor(Math.random() * subjects.length)];
        timetable[day][slot] = random?.Subject || "Free";
      });
    });

    const saved = await Timetable.create({ data: timetable });

    res.json(saved);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ✅ Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "faculty", password: "faculty123", role: "faculty" }
];

/*Protect Routes (Middleware)*/
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
