import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// @desc  Mark attendance by scanning/entering a ticketId (organizer/admin only)
// @route POST /api/attendance/check-in
export const checkInTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.body;
    if (!ticketId) return res.status(400).json({ message: "ticketId is required" });

    const registration = await Registration.findOne({ ticketId }).populate("event").populate("user", "name email");
    if (!registration) return res.status(404).json({ message: "Invalid ticket — not found" });

    const event = await Event.findById(registration.event._id);
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to check in attendees for this event" });
    }

    if (registration.status === "attended") {
      return res.status(400).json({ message: "This ticket has already been checked in", registration });
    }
    if (registration.status === "cancelled") {
      return res.status(400).json({ message: "This ticket was cancelled" });
    }

    registration.status = "attended";
    registration.attendedAt = new Date();
    await registration.save();

    res.json({ message: "Check-in successful", registration });
  } catch (error) {
    next(error);
  }
};

// @desc  Verify a ticket without marking attendance (quick lookup)
// @route GET /api/attendance/verify/:ticketId
export const verifyTicket = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({ ticketId: req.params.ticketId })
      .populate("event", "title date time location")
      .populate("user", "name email");
    if (!registration) return res.status(404).json({ message: "Invalid ticket" });
    res.json(registration);
  } catch (error) {
    next(error);
  }
};

// @desc  Get attendance list / stats for an event (organizer only)
// @route GET /api/attendance/event/:eventId
export const getAttendanceForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const registrations = await Registration.find({ event: event._id }).populate("user", "name email");
    const attended = registrations.filter((r) => r.status === "attended").length;

    res.json({
      total: registrations.length,
      attended,
      attendanceRate: registrations.length ? Math.round((attended / registrations.length) * 100) : 0,
      registrations,
    });
  } catch (error) {
    next(error);
  }
};
