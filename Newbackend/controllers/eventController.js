const Event = require('../models/eventModel');

// @desc    Create a new event
// @route   POST /api/events, POST /api/events/add, POST /api/events/create
// @access  Admin
const createEvent = async (req, res) => {
  try {
    const {
      eventName,
      location,
      eventLocation,
      locationImage,
      eventImage,
      eventDate,
      description,
      eventDescription,
      organizer,
      eventOrganizer,
      openingDate,
      closingDate,
      status,
      currentStatus,
      registrationFee,
      pricePerTicket,
      category,
    } = req.body;

    const loc = (location || eventLocation || '').trim();
    const name = (eventName || '').trim();
    const desc = description || eventDescription || '';
    const org = (organizer || eventOrganizer || '').trim();
    const stat = status || currentStatus || 'Ongoing';
    const fee = registrationFee || (pricePerTicket !== undefined ? String(pricePerTicket) : '0');
    const img = locationImage || eventImage || req.uploadedWebp || '';

    if (!name) {
      return res.status(400).json({ success: false, message: 'Event name is required' });
    }
    if (!loc) {
      return res.status(400).json({ success: false, message: 'Event location is required' });
    }
    if (!eventDate) {
      return res.status(400).json({ success: false, message: 'Event date is required' });
    }
    if (!desc) {
      return res.status(400).json({ success: false, message: 'Event description is required' });
    }
    if (!org) {
      return res.status(400).json({ success: false, message: 'Event organizer is required' });
    }
    if (!openingDate) {
      return res.status(400).json({ success: false, message: 'Opening date is required' });
    }
    if (!closingDate) {
      return res.status(400).json({ success: false, message: 'Closing date is required' });
    }

    const newEvent = await Event.create({
      eventName: name,
      location: loc,
      eventLocation: loc,
      locationImage: img,
      eventImage: img,
      eventDate,
      description: desc,
      eventDescription: desc,
      organizer: org,
      eventOrganizer: org,
      openingDate,
      closingDate,
      status: stat,
      currentStatus: stat,
      registrationFee: fee,
      pricePerTicket: Number(fee) || 0,
      category: category || '',
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully! 🎉',
      data: newEvent,
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating event',
    });
  }
};

// @desc    Get all events
// @route   GET /api/events, GET /api/events/all
// @access  Public / Admin
const getAllEvents = async (req, res) => {
  try {
    const { search, status, category } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = { $regex: new RegExp(`^${status}$`, 'i') };
    }

    if (category && category !== 'All') {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (search) {
      query.$or = [
        { eventName: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
      events: events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching events',
    });
  }
};

// @desc    Get events by status (for Frontend compatibility)
// @route   GET /api/events/status/:status
// @access  Public
const getEventsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const query = {
      $or: [
        { status: { $regex: new RegExp(`^${status}$`, 'i') } },
        { currentStatus: { $regex: new RegExp(`^${status}$`, 'i') } },
      ],
    };

    const events = await Event.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
      events: events,
    });
  } catch (error) {
    console.error('Error fetching events by status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching events',
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public / Admin
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
      event: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching event',
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Admin
const updateEvent = async (req, res) => {
  try {
    const {
      eventName,
      location,
      eventLocation,
      locationImage,
      eventImage,
      eventDate,
      description,
      eventDescription,
      organizer,
      eventOrganizer,
      openingDate,
      closingDate,
      status,
      currentStatus,
      registrationFee,
      pricePerTicket,
      category,
    } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (eventName) event.eventName = eventName.trim();
    if (location || eventLocation) {
      const loc = (location || eventLocation).trim();
      event.location = loc;
      event.eventLocation = loc;
    }
    const img = locationImage || eventImage || req.uploadedWebp;
    if (img) {
      event.locationImage = img;
      event.eventImage = img;
    }
    if (eventDate) event.eventDate = eventDate;
    if (description || eventDescription) {
      const desc = description || eventDescription;
      event.description = desc;
      event.eventDescription = desc;
    }
    if (organizer || eventOrganizer) {
      const org = (organizer || eventOrganizer).trim();
      event.organizer = org;
      event.eventOrganizer = org;
    }
    if (openingDate) event.openingDate = openingDate;
    if (closingDate) event.closingDate = closingDate;
    if (status || currentStatus) {
      const stat = status || currentStatus;
      event.status = stat;
      event.currentStatus = stat;
    }
    if (registrationFee !== undefined || pricePerTicket !== undefined) {
      const fee = registrationFee !== undefined ? String(registrationFee) : String(pricePerTicket);
      event.registrationFee = fee;
      event.pricePerTicket = Number(fee) || 0;
    }
    if (category) event.category = category.trim();

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully! 🎉',
      data: event,
      event: event,
    });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating event',
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting event',
    });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventsByStatus,
  getEventById,
  updateEvent,
  deleteEvent,
};
