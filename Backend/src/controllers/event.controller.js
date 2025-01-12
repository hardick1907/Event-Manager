import cloudinary from "../lib/cloudinary.js";
import Event from "../models/event.model.js";
import { io } from '../lib/socket.js';


export const CreateEvent = async (req, res) => {

    const { name,description,date,location,capacity,category,imageUrl } = req.body;
    try {

        if(!name || !description || !date || !location || !category||!capacity || !imageUrl) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
            folder: "events",
          });
        
        const newEvent = await Event.create({
            name,
            description,
            date,
            location,
            category,
            capacity,
            imageUrl: uploadResponse.secure_url,
            creator: req.user._id
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ message: error.message || 'Server error' });
    }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creator', 'name')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
}

export const getEventById = async (req, res) => { 
  try {
    const event = await Event.findById(req.params.id)
      .populate('creator', 'name')
      .populate('attendees', 'name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { name, description, date, location, capacity, category, imageUrl } = req.body;
  
  try {
      const event = await Event.findById(id);
      
      if (!event) {
          return res.status(404).json({ message: 'Event not found' });
      }

      if (event.creator.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Not authorized to update this event' });
      }

      let updatedImageUrl = event.imageUrl;
      if (imageUrl && imageUrl !== event.imageUrl) {
          const uploadResponse = await cloudinary.uploader.upload(imageUrl, {
              folder: "events",
          });
          updatedImageUrl = uploadResponse.secure_url;
      }

      const updatedEvent = await Event.findByIdAndUpdate(
          id,
          {
              name,
              description,
              date,
              location,
              capacity,
              category,
              imageUrl: updatedImageUrl,
          },
          { new: true }
      );

      res.json(updatedEvent);
  } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.attendees.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already attending' });
    }

    if (event.attendees.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.attendees.push(req.user._id);
    await event.save();

    io.emit(`event:${event._id}:memberUpdate`, event);

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.attendees = event.attendees.filter(
      attendee => attendee.toString() !== req.user._id.toString()
    );
    await event.save();

    io.emit(`event:${event._id}:memberUpdate`, event);

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};