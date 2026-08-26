import express from "express";
import { checkInTicket, verifyTicket, getAttendanceForEvent } from "../controllers/attendanceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/check-in", protect, checkInTicket);
router.get("/verify/:ticketId", protect, verifyTicket);
router.get("/event/:eventId", protect, getAttendanceForEvent);

export default router;
