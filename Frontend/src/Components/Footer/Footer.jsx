import React, { useState } from "react"; // ✅ FIX: add useState
import { FaFacebookF, FaWhatsapp , FaXTwitter, FaTelegram  , FaInstagram, FaYoutube } from "react-icons/fa6";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import footerlogo from "../../assets/UNQUE.png"
import "./Footer.css";
import axios from "axios";
import { API_URL } from "../../Api"; 

const Footer = () => {
  
 const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setMsg("⚠ Please enter your email");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
      setMsg(res.data.message);
      setEmail("");
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong ❌");
    }
  };

  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Company Info */}
        <div className="footer-section">
          <img src={footerlogo} alt="Company Logo" className="footer-logo" />
          <p className="footer-text">Digitally Marking The Extraordinary Achievement.</p>
          <div className="footer-contact">
            <p className="footer-item"><FaMapMarkerAlt className="icon" />Jaihind Tendua, District- Aurangabad, Bihar </p>
            <p className="footer-item"><FaMapMarkerAlt className="icon" /> Thekma, District- Azamgarh, Uttar Pradesh </p>
            <p className="footer-item"><FaMapMarkerAlt className="icon" /> Nandgran, District- Una, Himachal Pradesh </p>
            <p className="footer-item"><FaPhoneAlt className="icon" />+91 9472351693</p>
            <p className="footer-item"><FaEnvelope className="icon" />uruonline2025@gmail.com</p>
          </div>
        </div>
        {/* Categories */}
        
        <div className="footer-section">
    <h4 className="footer-heading">Useful Service</h4>
    <ul className="footer-list">
        <li>
            <a href="https://www.dpkavishek.in" target="_blank" rel="noopener noreferrer">
                Divya Prerak Kahaniyan™
            </a>
        </li>
        <li>
            <a href="https://www.dbmsonline.in" target="_blank" rel="noopener noreferrer">
                DBMS Online™
            </a>
        </li>
        <li>
            <a href="https://ouruniverse.in/" target="_blank" rel="noopener noreferrer">
                International Institute of Internship™
            </a>
        </li>
        <li>
            <a href="contact.html" target="_blank" rel="noopener noreferrer">
                Contact Us
            </a>
        </li>
    </ul>
</div>

       
       <div className="footer-section">
        <h4 className="footer-heading">Newsletter</h4>
        <p className="footer-text">
          Your Weekly/Monthly Dose of Knowledge and Inspiration
        </p>
        <div className="footer-newsletter">
          <input
            type="email"
            placeholder="Your email address"
            className="newsletter-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="newsletter-button" onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
        {msg && <p className="newsletter-msg">{msg}</p>}
      </div>

      </div>
      {/* Footer Bottom */}
      <div className="footer-bottom">
    <div className="footer-icons">
       <a href="https://www.facebook.com/groups/637109025434460/?ref=share&mibextid=lOuIew"><FaFacebookF className="social-icon" /></a> 
        <a href="https://ig.me/j/AbYpK-z9eMj7dSAv/"><FaInstagram className="social-icon" /></a>
       <a href="https://t.me/+jsAV_YA1yXgyN2Q1"> <FaTelegram  className="social-icon" /></a>
        <a href="https://chat.whatsapp.com/LrCIxNdOMdYDNOlFPA073k"><FaWhatsapp  className="social-icon" /></a>
        <FaXTwitter className="social-icon" />
        <FaYoutube className="social-icon" />
    </div>
    
    <div className="footer-links">
       <a href="/termandcondition"><span>Terms Of Services</span></a> 
        <a href="/termandcondition"><span>Privacy Policy</span></a>
       <a href="/termandcondition"> <span>Cancellation & Refund </span></a>
        <a href="/termandcondition"><span>Shipping & Delivery </span></a>
    </div>
    
    <p className="footer-bottom-text">
  Copyright © 2025. Powered by: <span>DPKHRC Trust</span> | Design & Develop <span> | ♡ PR Webstock</span>
</p>

</div>

    </footer>
  );
};

export default Footer;