import React, { useState } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiInfo,
  FiEye,
  FiAward,
  FiUsers,
  FiBookOpen,
  FiHelpCircle,
  FiImage  ,
  FiPhone,
  FiClipboard,
  FiCalendar  
} from "react-icons/fi";
import { FaRegNewspaper } from "react-icons/fa";


import "./Navbar.css";
import CompanyLogo from "../../assets/UNQUE.png";

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
          <li><a href="/vision"><FiEye className="nav-icon" /> Our Vision</a></li>
          <li><a href="/achivments"><FiAward className="nav-icon" /> Achievements</a></li>
          <li><a href="/notice"><FiClipboard className="nav-icon" /> Notice</a></li>
          <li><a href="/event"><FiCalendar   className="nav-icon" /> Event Registration </a></li>
          <li><a href="/media"><FiImage   className="nav-icon" /> Media</a></li>
          <li><a href="/blog"><FiBookOpen className="nav-icon" /> URU Post</a></li>
          <li><a href="/your-post"><FaRegNewspaper className="nav-icon" /> Your Post</a></li>
          <li><a href="/faq"><FiHelpCircle className="nav-icon" /> FAQ</a></li>
          <li><a href="/contact"><FiPhone className="nav-icon" /> Contact Us</a></li>
          
        </ul>

        <div className="nav-buttons">
  <a href="/donate">
    <button className="donate-button">Donate</button>
  </a>
  <a href="/login">
    <button className="sign-in">
      <FiUsers className="button-icon" /> Login
    </button>
  </a>
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
          <li><a href="/vision"><FiEye className="nav-icon" /> Our Vision</a></li>
          <li><a href="/achivments"><FiAward className="nav-icon" /> Achievements</a></li>
          <li><a href="/notice"><FiClipboard className="nav-icon" /> Notice</a></li>
          <li><a href="/event"><FiCalendar   className="nav-icon" /> Event Registration </a></li>
          <li><a href="/media"><FiImage className="nav-icon" /> Media</a></li>
          <li><a href="/blog"><FiBookOpen className="nav-icon" /> URU Post</a></li>
          <li><a href="/your-post"><FaRegNewspaper className="nav-icon" /> Your Post</a></li>
          <li><a href="/faq"><FiHelpCircle className="nav-icon" /> FAQ</a></li>
          <li><a href="/contact"><FiPhone className="nav-icon" /> Contact Us</a></li>
        </ul>
        
        <div className="mobile-login">
  <a href="/donate">
    <button className="mobile-donate">Donate</button>
  </a>
  <a href="/login">
    <button className="mobile-sign-in">
      <FiUsers className="button-icon" /> Login
    </button>
  </a>
</div>

        

         </div>
    </nav>
  );
};

export default Navbar;
