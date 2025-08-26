import React, { useState } from "react";
import { FaHome, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import './ContactForm.css';

const ContactPage = () => {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    // Your Web3Forms public access key
    formData.append("access_key", "fb86678f-47b3-4e43-86cd-f01157e658c6");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setResult("Form Submitted Successfully ✅");
        event.target.reset();
      } else {
        console.log("Error", data);
        setResult(data.message || "Something went wrong ❌");
      }
    } catch (err) {
      console.error(err);
      setResult("Something went wrong ❌");
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
