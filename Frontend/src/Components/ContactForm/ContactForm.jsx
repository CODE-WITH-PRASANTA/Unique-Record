import React, { useState } from "react";
import { FaHome, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import './ContactForm.css';

import axios from "axios";
import { API_URL } from "../../Api";

const ContactPage = () => {
  const [result, setResult] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setResult("Sending...");
    
    const formElement = event.target;
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await axios.post(`${API_URL}/contact`, data);

      if (response.data && response.data.success) {
        setResult("Form Submitted Successfully ✅");
        formElement.reset();
      } else {
        setResult(response.data?.message || "Something went wrong ❌");
      }
    } catch (err) {
      console.error("Error submitting contact form:", err);
      setResult(err.response?.data?.message || "Something went wrong ❌");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-form-wrapper">
        <h2 className="contact-title">Communicate with us</h2>
        <p className="contact-description">
          If you have any questions or doubts about the activities, programs or any other related matter of "Unique Records of Universe" and DPKHRC Trust, please write to us. We look forward to responding to your queries promptly and comprehensively.
        </p>
        <form className="contact-form" onSubmit={onSubmit}>
          <div className="form-row">
            <input type="text" name="name" placeholder="Your Name" className="form-input" required />
            <input type="email" name="email" placeholder="Email Address" className="form-input" required />
          </div>
          <div className="form-row">
            <input type="text" name="phone" placeholder="Phone Number" className="form-input" />
            <input type="text" name="address" placeholder="Address" className="form-input" />
          </div>
          <textarea name="message" placeholder="Write your message here" className="form-textarea" required></textarea>
          <button type="submit" className="form-button">Submit</button>
        </form>
        {result && <p className="form-result">{result}</p>}
      </div>

      <div className="contact-info-wrapper">
        <h2 className="contact-title">Contact with us</h2>
        <p className="contact-description">
          You can correspond with us at our office address. You can contact us directly on our mobile number or write to our email ID. Our association with you is our top priority.
        </p>
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
          <a href="https://www.facebook.com/groups/637109025434460/?ref=share&mibextid=lOuIew" target="_blank" rel="noreferrer"><FaFacebookF className="contact-social-icon" /></a>
          <a href="https://ig.me/j/AbYpK-z9eMj7dSAv/" target="_blank" rel="noreferrer"><FaInstagram className="contact-social-icon" /></a>
          <a href="https://chat.whatsapp.com/LrCIxNdOMdYDNOlFPA073k" target="_blank" rel="noreferrer"><FaWhatsapp className="contact-social-icon" /></a>
          <a href="https://t.me/+jsAV_YA1yXgyN2Q1" target="_blank" rel="noreferrer"><FaTelegramPlane className="contact-social-icon" /></a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
