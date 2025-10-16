import React, { useState } from "react";
import {
  FaFacebookF,
  FaWhatsapp,
  FaXTwitter,
  FaTelegram,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import footerlogo from "../../assets/UNQUE.png";
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
      <div className="footer-container">
        {/* ===== Company Info ===== */}
        <div className="footer-col section-card">
          <img src={footerlogo} alt="Company Logo" className="footer-logo" />
          <p className="footer-description">
            Digitally Marking The Extraordinary Achievement.
          </p>
          <div className="footer-contact">
            <p><FaMapMarkerAlt /> Jaihind Tendua, Aurangabad, Bihar</p>
            <p><FaMapMarkerAlt /> Thekma, Azamgarh, Uttar Pradesh</p>
            <p><FaMapMarkerAlt /> Nandgran, Una, Himachal Pradesh</p>
            <p><FaPhoneAlt /> +91 9472351693</p>
            <p><FaEnvelope /> uruonline2025@gmail.com</p>
          </div>
        </div>

        {/* ===== Useful Links ===== */}
        <div className="footer-col section-card">
          <h4>Useful Services</h4>
          <ul>
            <li><a href="https://www.dpkavishek.in" target="_blank">Divya Prerak Kahaniyan™</a></li>
            <li><a href="https://www.dbmsonline.in" target="_blank">DBMS Online™</a></li>
            <li><a href="https://ouruniverse.in/" target="_blank">International Institute of Internship™</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* ===== Newsletter ===== */}
        <div className="footer-col section-card">
          <h4>Newsletter</h4>
          <p className="footer-description">
            Get weekly insights, updates, and inspiration directly to your inbox.
          </p>
          <div className="newsletter">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSubscribe}>Subscribe</button>
          </div>
          {msg && <p className="newsletter-msg">{msg}</p>}
        </div>
      </div>

      {/* ===== Footer Bottom ===== */}
      <div className="footer-bottom">
        <div className="footer-social">
          <a href="https://www.facebook.com/groups/637109025434460/"><FaFacebookF /></a>
          <a href="https://ig.me/j/AbYpK-z9eMj7dSAv/"><FaInstagram /></a>
          <a href="https://t.me/+jsAV_YA1yXgyN2Q1"><FaTelegram /></a>
          <a href="https://chat.whatsapp.com/LrCIxNdOMdYDNOlFPA073k"><FaWhatsapp /></a>
          <FaXTwitter />
          <FaYoutube />
        </div>

        <div className="footer-links">
          <a href="/termandcondition">Terms of Service</a>
          <a href="/termandcondition">Privacy Policy</a>
          <a href="/termandcondition">Refund Policy</a>
          <a href="/termandcondition">Delivery Info</a>
        </div>

        <p className="footer-credit">
            © 2025 <span>DPKHRC Trust</span>. Crafted with ❤️ by{" "}
            <a href="https://prwebstock.com/" target="_blank" rel="noopener noreferrer">
              <span>PR Webstock</span>
            </a>
          </p>

      </div>
    </footer>
  );
};

export default Footer;
