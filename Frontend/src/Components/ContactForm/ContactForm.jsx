import React from "react";
import { FaHome, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp , FaLinkedinIn , FaTelegramPlane  } from "react-icons/fa";
import './ContactForm.css';

const ContactPage = () => {
  return (
    <div className="contact-container">
      <div className="contact-form-wrapper">
        <h2 className="contact-title">Communicate with us</h2>
        <p className="contact-description">If you have any questions or doubts about the activities, programs or any other related matter of "Unique Records of Universe" and DPKHRC Trust, please write to us. We look forward to responding to your queries promptly and comprehensively.</p>
        <form className="contact-form">
          <div className="form-row">
            <input type="text" placeholder="Your Name" className="form-input" />
            <input type="email" placeholder="Email Address" className="form-input" />
          </div>
          <div className="form-row">
            <input type="text" placeholder="Phone Number" className="form-input" />
            <input type="text" placeholder="Address" className="form-input" />
          </div>
          <textarea placeholder="Write here message" className="form-textarea"></textarea>
          <button type="submit" className="form-button">Submit</button>
        </form>
      </div>

      <div className="contact-info-wrapper">
        <h2 className="contact-title">Contact with us</h2>
        <p className="contact-description">You can correspond with us at our office address. You can contact us directly on our mobile number or write to our email ID. Our association with you is our top priority.</p>
        <div className="contact-details">
          <div className="detail-item">
            <FaHome className="icon" />
            <span>Thekma, District- Azamgarh, Uttar Pradesh </span>
          </div>
          <div className="detail-item">
            <FaPhoneAlt className="icon" />
            <span>+91 9472351693</span>
          </div>
          <div className="detail-item">
            <FaEnvelope className="icon" />
            <span>uruonline2025@gmail.com</span>
          </div>
        </div>

        <h3 className="contact-social-title">Follow Us</h3>
        <div className="contact-contact-social-icons">
          <a href="https://www.facebook.com/groups/637109025434460/?ref=share&mibextid=lOuIew"><FaFacebookF className="contact-social-icon" /></a>
          <a href="https://ig.me/j/AbYpK-z9eMj7dSAv/"><FaInstagram className="contact-social-icon" /></a>
          <a href="https://chat.whatsapp.com/LrCIxNdOMdYDNOlFPA073k"> <FaWhatsapp  className="contact-social-icon" /></a>
         <a href="https://t.me/+jsAV_YA1yXgyN2Q1"> <FaTelegramPlane  className="contact-social-icon" /></a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;