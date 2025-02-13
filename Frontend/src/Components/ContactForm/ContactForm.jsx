import React from "react";
import { FaHome, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaPinterestP, FaLinkedinIn } from "react-icons/fa";
import './ContactForm.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-form-wrapper">
        <h2 className="contact-title">Let’s Talk</h2>
        <p className="contact-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <form className="contact-form">
          <div className="form-row">
            <input type="text" placeholder="Your Name" className="form-input" />
            <input type="email" placeholder="Email Address" className="form-input" />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Phone Number" className="form-input" />
            <input type="text" placeholder="Project Details" className="form-input" />
          </div>
          <textarea placeholder="Write here message" className="form-textarea"></textarea>
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>

      <div className="contact-info-wrapper">
        <h2 className="contact-title">Contact with us</h2>
        <p className="contact-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <div className="contact-details">
          <div className="detail-item">
            <FaHome className="icon" />
            <span>121 King Street, Melbourne Evonic Soft, 3000 New york, USA.</span>
          </div>
          <div className="detail-item">
            <FaPhoneAlt className="icon" />
            <span>+1(800) 060-07-30</span>
          </div>
          <div className="detail-item">
            <FaEnvelope className="icon" />
            <span>yourname@example.com</span>
          </div>
        </div>

        <h3 className="contact-social-title">Follow Us</h3>
        <div className="contact-contact-social-icons">
          <FaFacebookF className="contact-social-icon" />
          <FaInstagram className="contact-social-icon" />
          <FaPinterestP className="contact-social-icon" />
          <FaLinkedinIn className="contact-social-icon" />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;