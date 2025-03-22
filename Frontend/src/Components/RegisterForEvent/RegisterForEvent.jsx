import React, { useState, useEffect } from "react";
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
import "./RegisterForEvent.css";

const RegisterForEvent = () => {
    const location = useLocation();
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
    }, [location.search]);

  return (
    <div className="event-container">
      <h2 className="event-heading">Event Registration Form</h2>
      <form className="event-form">
        
        {/* Event, Name, and Sex */}
        <div className="event-row">

        <div className="event-group">
          <label>
            <FaCalendarAlt /> Event Name *
          </label>
          <input type="text" value={eventName} readOnly />
        </div>

          <div className="event-group">
            <label><FaUser /> Applicant Name *</label>
            <input type="text" required />
          </div>

          <div className="event-group">
            <label>Sex *</label>
            <div className="event-radio">
              <input type="radio" name="sex" value="Male" /> Male
              <input type="radio" name="sex" value="Female" /> Female
              <input type="radio" name="sex" value="Transgender" /> Transgender
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
          <label>
            <FaMoneyBillWave /> Price *
          </label>
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
