import React from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./MainContactForm.css";

const MainContactForm = () => {
  return (
    <section className="main-contact-form-section">
      <div className="main-contact-form-container">
      <div className="main-contact-form-info">
          <h2 className="main-contact-form-heading">HOW WE CAN HELP?</h2>
          <p className="main-contact-form-description">
            Have a new question beyond this FAQs? Call Us, Email Us or use
            below form to ask us about any of your doubt, we respond in
            <i> 24 hours.</i>
          </p>
          <div className="main-contact-form-details">
            <div className="main-contact-form-item">
              <FaMapMarkerAlt className="main-contact-form-icon" />
              <div>
                <h4 className="main-contact-form-subheading">OUR LOCATION</h4>
                <p>11 New Avenue, Lane 08, New York, USA</p>
              </div>
            </div>
            <div className="main-contact-form-item">
              <FaPhoneAlt className="main-contact-form-icon" />
              <div>
                <h4 className="main-contact-form-subheading">24/7 SUPPORT</h4>
                <p>+1800-corona-help</p>
                <p>+1 9988 1010 10</p>
              </div>
            </div>
            <div className="main-contact-form-item">
              <FaEnvelope className="main-contact-form-icon" />
              <div>
                <h4 className="main-contact-form-subheading">EMAIL US</h4>
                <p>help@veneno.com</p>
                <p>support@veneno.com</p>
              </div>
            </div>
          </div>
        </div>

        
        <div className="main-contact-form-form">
          <form>
            <div className="main-contact-form-group">
              <input type="text" placeholder="eg. John Doe" required />
              <input type="email" placeholder="name@website.com" required />
            </div>
            <div className="main-contact-form-group">
              <input type="text" placeholder="Mobile number" required />
              <input type="text" placeholder="Enter zip/pin code" required />
            </div>
            <textarea placeholder="Write your question" required></textarea>
            <button type="submit" className="main-contact-form-button">SUBMIT NOW</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MainContactForm;