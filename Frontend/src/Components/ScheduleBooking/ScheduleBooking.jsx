import React from "react";
import "./ScheduleBooking.css";
import meetingImage from "../../assets/conact-event-book.png";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClipboardList } from "react-icons/fa";



const ScheduleBooking = () => {
  return (
    <div className="Schedule-Booking-Container">

      <div className="Schedule-Booking-Form">
        <h2 className="Schedule-Booking-Title">Request to Book a Schedule</h2>
        <form>
          <div className="Schedule-Booking-InputGroup">
            <div className="Schedule-Booking-InputWrapper">
              <FaUser className="Schedule-Booking-Icon" />
              <input type="text" placeholder="First Name *" className="Schedule-Booking-Input" required />
            </div>
            <div className="Schedule-Booking-InputWrapper">
              <FaUser className="Schedule-Booking-Icon" />
              <input type="text" placeholder="Last Name *" className="Schedule-Booking-Input" required />
            </div>
          </div>

          <div className="Schedule-Booking-InputGroup">
            <div className="Schedule-Booking-InputWrapper">
              <FaEnvelope className="Schedule-Booking-Icon" />
              <input type="email" placeholder="Enter Your Email *" className="Schedule-Booking-Input" required />
            </div>
            <div className="Schedule-Booking-InputWrapper">
              <FaPhone className="Schedule-Booking-Icon" />
              <input type="tel" placeholder="Enter Phone Number *" className="Schedule-Booking-Input" required />
            </div>
          </div>

          <div className="Schedule-Booking-InputGroup">
            <div className="Schedule-Booking-InputWrapper">
              <FaClipboardList className="Schedule-Booking-Icon" />
              <select className="Schedule-Booking-Select" required>
                <option value="">Select an Option...</option>
                <option value="Consultation">Consultation</option>
                <option value="Demo">Demo</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div className="Schedule-Booking-InputWrapper">
              <FaCalendarAlt className="Schedule-Booking-Icon" />
              <input type="date" className="Schedule-Booking-Input" required />
            </div>
          </div>

          <div className="Schedule-Booking-TextAreaWrapper">
            <textarea placeholder="Additional Notes" className="Schedule-Booking-TextArea"></textarea>
          </div>

          <button type="submit" className="Schedule-Booking-Button">Book Now</button>
        </form>
      </div>
      <div className="Schedule-Booking-Image">
        <img src={meetingImage} alt="Meeting" className="Schedule-Booking-Img" />
      </div>

    </div>
  );
};

export default ScheduleBooking;
