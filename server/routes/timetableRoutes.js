import express from "express";
import { createTimetable } from "../controllers/timetableController.js";

const router = express.Router();

router.post("/generate", createTimetable);

export default router;