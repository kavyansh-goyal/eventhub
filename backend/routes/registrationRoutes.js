import express from "express";
import {
  registerForEvent,
  getMyTickets,
  getTicketById,
  getEventRegistrations,
  cancelRegistration,
  resendTicketEmail,
} from "../controllers/registrationController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/mine", protect, getMyTickets);
router.get("/event/:eventId", protect, getEventRegistrations);
router.get("/:id", protect, getTicketById);
router.post("/:eventId", protect, registerForEvent);
router.post("/:id/resend", protect, resendTicketEmail);
router.delete("/:id", protect, cancelRegistration);

export default router;
