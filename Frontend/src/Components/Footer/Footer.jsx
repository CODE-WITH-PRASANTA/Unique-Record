import React from 'react';
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaTelegram  , FaInstagram, FaYoutube } from "react-icons/fa6";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import footerlogo from "../../assets/UNQUE.png"
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        {/* Company Info */}
        <div className="footer-section">
          <img src={footerlogo} alt="Company Logo" className="footer-logo" />
          <p className="footer-text">Specializes in providing high-class tours for those in need. Contact Us</p>
          <div className="footer-contact">
            <p className="footer-item"><FaMapMarkerAlt className="icon" />101 E 129th St, East Chicago, IN 46312, US</p>
            <p className="footer-item"><FaPhoneAlt className="icon" />1-333-345-6868</p>
            <p className="footer-item"><FaEnvelope className="icon" />themesflat@gmail.com</p>
          </div>
        </div>
        {/* Categories */}
        
        <div className="footer-section">
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-list">
            <li>Our Vision</li>
            <li>Our Services</li>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>
        {/* Our Company */}
        <div className="footer-section">
          <h4 className="footer-heading">Our Achivement</h4>
          <ul className="footer-list">
            <li>xxxxxxxxx</li>
            <li>xxxxxxxxx</li>
            <li>xxxxxxxxxx</li>
            <li>xxxxxxxxxx</li>
          </ul>
        </div>
        
        {/* Newsletter */}
        <div className="footer-section">
          <h4 className="footer-heading">Newsletter</h4>
          <p className="footer-text">Your Weekly/Monthly Dose of Knowledge and Inspiration</p>
          <div className="footer-newsletter">
            <input type="email" placeholder="Your email address" className="newsletter-input" />
            <button className="newsletter-button">Subscribe</button>
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="footer-bottom">
    <div className="footer-icons">
       <a href="https://www.facebook.com/groups/637109025434460/?ref=share&mibextid=lOuIew"><FaFacebookF className="social-icon" /></a> 
        <a href="https://ig.me/j/AbYpK-z9eMj7dSAv/"><FaInstagram className="social-icon" /></a>
       <a href="https://t.me/+jsAV_YA1yXgyN2Q1"> <FaTelegram  className="social-icon" /></a>

        <FaLinkedinIn className="social-icon" />
        <FaXTwitter className="social-icon" />
        <FaYoutube className="social-icon" />
    </div>
    
    <div className="footer-links">
       <a href="/termandcondition"><span>Terms Of Services</span></a> 
        <a href="/termandcondition"><span>Privacy Policy</span></a>
       <a href="/termandcondition"> <span>Cancellation & Refund </span></a>
        <a href="/termandcondition"><span>Shipping & Delivery </span></a>
    </div>
    
    <p className="footer-bottom-text">Copyright © All Rights Reserved © 2025. Powered by <span> | ♡ PR Webstock </span></p>
</div>

    </footer>
  );
};

export default Footer;