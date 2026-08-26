import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
} from "../controllers/eventController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", getEvents);
router.get("/mine/list", protect, authorize("organizer", "admin"), getMyEvents);
router.get("/:id", getEventById);
router.post("/", protect, authorize("organizer", "admin"), upload.single("poster"), createEvent);
router.put("/:id", protect, authorize("organizer", "admin"), upload.single("poster"), updateEvent);
router.delete("/:id", protect, authorize("organizer", "admin"), deleteEvent);

export default router;
