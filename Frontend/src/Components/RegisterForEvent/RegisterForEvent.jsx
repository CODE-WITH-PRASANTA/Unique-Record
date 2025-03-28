import React, { useState, useEffect } from "react";
import { API_URL } from "../../Api"; // Adjust the path if needed
import { useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaGlobe,
  FaFileUpload,
  FaCamera,
  FaGraduationCap,
} from "react-icons/fa";
import axios from "axios";
import "./RegisterForEvent.css";

const RegisterForEvent = () => {
  const location = useLocation();
  const [events, setEvents] = useState([]); // Store ongoing events
  const [eventName, setEventName] = useState("");
  const [eventPrice, setEventPrice] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const eventNameParam = urlParams.get("eventName");
    const eventPriceParam = urlParams.get("eventPrice");

    if (eventNameParam && eventPriceParam) {
      setEventName(decodeURIComponent(eventNameParam));
      setEventPrice(eventPriceParam);
    }


const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events/status/Ongoing`);
    setEvents(response.data.events); // Store fetched events
  } catch (error) {
    console.error("Error fetching events:", error);
  }
};


    fetchEvents();
  }, [location.search]);

  // Handle event selection
  const handleEventChange = (e) => {
    const selectedEvent = events.find(event => event.eventName === e.target.value);
    setEventName(selectedEvent.eventName);
    setEventPrice(selectedEvent.pricePerTicket);
  };

  return (
    <div className="event-container">
      <h2 className="event-heading">Event Registration Form</h2>
      <form className="event-form">
        
        {/* Event Selection */}
        <div className="event-row">
          <div className="event-group">
            <label><FaCalendarAlt /> Event Name *</label>
            <select value={eventName} onChange={handleEventChange} required>
              <option value="">Select an Event</option>
              {events.map(event => (
                <option key={event._id} value={event.eventName}>
                  {event.eventName}
                </option>
              ))}
            </select>
          </div>

          <div className="event-group">
            <label><FaUser /> Applicant Name *</label>
            <input type="text" required />
          </div>

          <div className="event-group">
            <label>Sex *</label>
            <div className="event-radio">
              <input type="radio" name="sex" value="Male" required /> Male
              <input type="radio" name="sex" value="Female" required /> Female
              <input type="radio" name="sex" value="Transgender" required /> Transgender
            </div>
          </div>
        </div>

        {/* DOB, Price, and WhatsApp Number */}
        <div className="event-row">
          <div className="event-group">
            <label><FaCalendarAlt /> Date of Birth *</label>
            <input type="date" required />
          </div>

          <div className="event-group">
            <label><FaMoneyBillWave /> Price *</label>
            <input type="text" value={`₹${eventPrice}`} readOnly />
          </div>

          <div className="event-group">
            <label><FaMobileAlt /> WhatsApp Mobile Number *</label>
            <input type="tel" maxLength="10" required />
          </div>
        </div>

        {/* Address Details */}
        <div className="event-row">
          <div className="event-group">
            <label><FaMapMarkerAlt /> Pin Code *</label>
            <input type="text" maxLength="6" required />
          </div>
          <div className="event-group">
            <label>District *</label>
            <input type="text" required />
          </div>
          <div className="event-group">
            <label>State *</label>
            <input type="text" required />
          </div>
        </div>

        {/* Email & Website */}
        <div className="event-row">
          <div className="event-group">
            <label><FaEnvelope /> Email ID *</label>
            <input type="email" required />
          </div>
          <div className="event-group">
            <label><FaGlobe /> Website</label>
            <input type="url" />
          </div>
        </div>

        {/* Education & Skills */}
        <div className="event-group">
          <label><FaGraduationCap /> Educational Qualification *</label>
          <input type="text" required />
        </div>
        <div className="event-group">
          <label>Your Area of Expertise & Special Skills</label>
          <textarea></textarea>
        </div>

        {/* File Uploads */}
        <div className="event-row">
          <div className="event-group">
            <label><FaFileUpload /> Attach Bio-data (Max 25MB) *</label>
            <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" required />
          </div>
          <div className="event-group">
            <label><FaCamera /> Upload Your Passport Size Photo *</label>
            <input type="file" accept=".jpg,.jpeg,.png" required />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="event-submit">Save & Continue</button>
      </form>
    </div>
  );
};

export default RegisterForEvent;
