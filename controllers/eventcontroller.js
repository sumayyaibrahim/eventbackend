const Event = require("../models/Event");

// GET all events (User + Admin)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1, start: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE event (Admin)
exports.createEvent = async (req, res) => {
  const { title, date, start, end } = req.body;

  if (!title || !date || !start || !end) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const sameDayEvents = await Event.find({ date });

    const overlap = sameDayEvents.some(
      (e) => start < e.end && end > e.start
    );

    if (overlap) {
      return res
        .status(400)
        .json({ message: "Time slot already booked" });
    }

    const newEvent = new Event({ title, date, start, end });
    await newEvent.save();

    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE event (Admin)
exports.updateEvent = async (req, res) => {
  const { title, date, start, end } = req.body;

  try {
    const event = await Event.findById(req.params.id);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    const sameDayEvents = await Event.find({
      date,
      _id: { $ne: event._id }
    });

    const overlap = sameDayEvents.some(
      (e) => start < e.end && end > e.start
    );

    if (overlap) {
      return res
        .status(400)
        .json({ message: "Time slot already booked" });
    }

    event.title = title;
    event.date = date;
    event.start = start;
    event.end = end;

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE event (Admin)
exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
