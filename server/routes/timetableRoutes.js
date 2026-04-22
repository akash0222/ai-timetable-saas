import express from "express";
import { generateTimetable } from "../controllers/timetableController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateTimetable);

export default router;