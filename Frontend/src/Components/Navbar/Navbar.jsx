import React, { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiEye,
  FiAward,
  FiBell,
  FiUsers,
  FiBookOpen,
  FiHelpCircle,
  FiPhone,
} from "react-icons/fi";

import "./Navbar.css";
import CompanyLogo from "../../assets/UN QUE.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo Section */}
        <div className="logo">
          <img src={CompanyLogo} alt="Company Logo" />
        </div>

        {/* Desktop Navigation */}
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li><a href="/"><FiHome className="nav-icon" /> Home</a></li>
          <li><a href="/about"><FiInfo className="nav-icon" /> About Us</a></li>
          <li><a href="#"><FiEye className="nav-icon" /> Our Vision</a></li>
          <li><a href="#"><FiAward className="nav-icon" /> Achievements</a></li>
          <li><a href="#"><FiBell className="nav-icon" /> Notice</a></li>
          <li><a href="#"><FiBookOpen className="nav-icon" /> Blog</a></li>
          <li><a href="#"><FiHelpCircle className="nav-icon" /> FAQ</a></li>
          <li><a href="/contact"><FiPhone className="nav-icon" /> Contact Us</a></li>
        </ul>

        {/* Right Section */}
        <div className="nav-buttons">
          <button className="sign-in">
            <FiUsers className="button-icon" /> Login
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
        <ul>
          <li><a href="/"><FiHome className="nav-icon" /> Home</a></li>
          <li><a href="/about"><FiInfo className="nav-icon" /> About Us</a></li>
          <li><a href="#"><FiEye className="nav-icon" /> Our Vision</a></li>
          <li><a href="#"><FiAward className="nav-icon" /> Achievements</a></li>
          <li><a href="#"><FiBell className="nav-icon" /> Notice</a></li>
          <li><a href="#"><FiBookOpen className="nav-icon" /> Blog</a></li>
          <li><a href="#"><FiHelpCircle className="nav-icon" /> FAQ</a></li>
          <li><a href="/contact"><FiPhone className="nav-icon" /> Contact Us</a></li>
        </ul>
        
        {/* Mobile Login Button */}
        <div className="mobile-login">
          <button className="mobile-sign-in">
            <FiUsers className="button-icon" /> Login
          </button>
        </div>
        

         </div>
    </nav>
  );
};

export default Navbar;
