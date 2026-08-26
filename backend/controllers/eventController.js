import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import fs from "fs";
import path from "path";

// @desc  Create a new event (with optional poster upload)
// @route POST /api/events
export const createEvent = async (req, res, next) => {
  try {
    const { title, description, category, date, time, location, capacity } = req.body;
    if (!title || !description || !date || !time || !location) {
      return res.status(400).json({ message: "Missing required event fields" });
    }

    const event = await Event.create({
      title,
      description,
      category,
      date,
      time,
      location,
      capacity: capacity || 100,
      poster: req.file ? `/uploads/${req.file.filename}` : "",
      organizer: req.user._id,
    });

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc  Get all events (with search / category filter / upcoming filter)
// @route GET /api/events
export const getEvents = async (req, res, next) => {
  try {
    const { search, category, upcoming } = req.query;
    const filter = {};

    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (upcoming === "true") filter.date = { $gte: new Date() };

    const events = await Event.find(filter).populate("organizer", "name email").sort({ date: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc  Get single event by id
// @route GET /api/events/:id
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc  Update an event (organizer/admin only, and only the owner)
// @route PUT /api/events/:id
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to edit this event" });
    }

    const fields = ["title", "description", "category", "date", "time", "location", "capacity"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) event[f] = req.body[f];
    });

    if (req.file) {
      // remove old poster if it exists
      if (event.poster) {
        const oldPath = path.join(process.cwd(), event.poster.replace(/^\//, ""));
        fs.unlink(oldPath, () => {});
      }
      event.poster = `/uploads/${req.file.filename}`;
    }

    const updated = await event.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc  Delete an event
// @route DELETE /api/events/:id
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc  Get events created by the logged-in organizer
// @route GET /api/events/mine/list
export const getMyEvents = async (req, res, next) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    next(error);
  }
};
