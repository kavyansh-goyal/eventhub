import { v4 as uuidv4 } from "uuid";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import { generateQRCode } from "../utils/generateQR.js";
import sendEmail from "../utils/sendEmail.js";

// @desc  Register (book a ticket) for an event — generates QR ticket + sends email
// @route POST /api/registrations/:eventId
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.registeredCount >= event.capacity) {
      return res.status(400).json({ message: "This event is fully booked" });
    }

    const alreadyRegistered = await Registration.findOne({ event: event._id, user: req.user._id });
    if (alreadyRegistered) {
      return res.status(400).json({ message: "You already have a ticket for this event" });
    }

    const ticketId = uuidv4();
    const qrCode = await generateQRCode(ticketId);

    const registration = await Registration.create({
      event: event._id,
      user: req.user._id,
      ticketId,
      qrCode,
    });

    event.registeredCount += 1;
    await event.save();

    // Fire-and-forget email notification with the QR ticket
    sendEmail({
      to: req.user.email,
      subject: `Your ticket for ${event.title}`,
      html: `
        <h2>You're registered for ${event.title}!</h2>
        <p>Date: ${new Date(event.date).toDateString()} at ${event.time}</p>
        <p>Location: ${event.location}</p>
        <p>Ticket ID: <b>${ticketId}</b></p>
        <img src="${qrCode}" alt="Ticket QR Code" />
        <p>Show this QR code at the entrance for attendance check-in.</p>
      `,
    }).catch((err) => console.error("Email send failed:", err.message));

    res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged-in user's tickets
// @route GET /api/registrations/mine
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Registration.find({ user: req.user._id })
      .populate("event", "title date time location poster")
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

// @desc  Get single ticket by id (owner only)
// @route GET /api/registrations/:id
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Registration.findById(req.params.id).populate("event");
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this ticket" });
    }
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all registrations for an event (organizer only)
// @route GET /api/registrations/event/:eventId
export const getEventRegistrations = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const registrations = await Registration.find({ event: event._id }).populate("user", "name email");
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// @desc  Cancel a registration (owner only)
// @route DELETE /api/registrations/:id
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await registration.deleteOne();
    await Event.findByIdAndUpdate(registration.event, { $inc: { registeredCount: -1 } });

    res.json({ message: "Registration cancelled" });
  } catch (error) {
    next(error);
  }
};

// @desc  Resend the ticket email
// @route POST /api/registrations/:id/resend
export const resendTicketEmail = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id).populate("event");
    if (!registration) return res.status(404).json({ message: "Registration not found" });
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await sendEmail({
      to: req.user.email,
      subject: `Your ticket for ${registration.event.title}`,
      html: `<p>Ticket ID: <b>${registration.ticketId}</b></p><img src="${registration.qrCode}" />`,
    });

    res.json({ message: "Ticket email resent" });
  } catch (error) {
    next(error);
  }
};
