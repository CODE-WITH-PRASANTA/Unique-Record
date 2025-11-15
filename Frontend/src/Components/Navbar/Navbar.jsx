import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiInfo,
  FiEye,
  FiAward,
  FiStar,
  FiClipboard,
  FiCalendar,
  FiImage,
  FiBookOpen,
  FiHelpCircle,
  FiPhone,
} from "react-icons/fi"; // ✅ All Fi icons
import { FaRegNewspaper } from "react-icons/fa"; // ✅ For URU Post submenu
import "./Navbar.css";
import logo from "../../assets/UNQUE.png";


const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const menuRef = useRef();
  const lastScrollY = useRef(0);

  // Detect scroll for Navbar only
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowNavbar(false); // hide when scrolling down
      } else {
        setShowNavbar(true); // show when scrolling up
      }
      lastScrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        setMobileDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (index) => {
    setMobileDropdownOpen(mobileDropdownOpen === index ? null : index);
  };

  // ✅ Updated Menu Items (without Donate/Login)
const menuItems = [
  { name: "Home", path: "/", icon: <FiHome /> },
  { name: "About Us", path: "/about", icon: <FiInfo /> },
  { name: "Our Vision", path: "/vision", icon: <FiEye /> },
  { name: "Achievements", path: "/achivments", icon: <FiAward /> },
  { name: "URU Holder's", path: "/achievers", icon: <FiStar /> },
  { name: "Notice", path: "/notice", icon: <FiClipboard /> },
  { name: "Event Registration", path: "/event", icon: <FiCalendar /> },
  { name: "Media", path: "/media", icon: <FiImage /> },
  {
    name: "URU Post",
    icon: <FiBookOpen />,
    sub: [
      { name: "Read Blog Post", path: "/blog", icon: <FaRegNewspaper /> },
      { name: "Write Blog Post", path: "/your-post", icon: <FaRegNewspaper /> },
    ],
  },
  { name: "FAQ", path: "/faq", icon: <FiHelpCircle /> },
  { name: "Contact", path: "/contact", icon: <FiPhone /> },
];


  return (
    <>
      {/* ===== Top Bar ===== */}
      {/* ===== Top Bar ===== */}
    <div className="topbar">
      <div className="topbar-container">
        <div className="topbar-content">
          <div className="topbar-left">
            <a href="tel:9472351693" className="topbar-item">
              📞 <span>+91 - 94723 51693</span>
            </a>
            <a href="mailto:uruonline2025@gmail.com" className="topbar-item">
              ✉  <span> uruonline2025@gmail.com</span>
            </a>
          </div>
          <div className="topbar-right">
            <Link to="/login" className="topbar-login">🔑 Login / Register</Link>
            <Link to="/donate" className="topbar-cta">💖 Donate</Link>
          </div>
        </div>
      </div>
    </div>

      {/* ===== Navbar ===== */}
      <header className={`Nav-navbar-wrapper ${showNavbar ? "show" : "hide"}`}>
          <nav className="Nav-navbar">
            <div className="Nav-container Nav-navbar-inner">
              <div className="Nav-logo-wrapper">
                <Link to="/" className="Nav-logo"><img src={logo} alt="EduBlink" /></Link>
              </div>
              <button className="Nav-toggler" onClick={() => setMobileMenuOpen(true)}>☰</button>

              <ul className="Nav-menu">
                {menuItems.map((item, i) => (
                  <li className="Nav-item dropdown" key={i}>
                    {item.name === "Get a Quote" ? (
                      <Link className="Nav-donate-btn" to={item.path}>{item.name}</Link>
                    ) : (
                      <>
                        <Link className="Nav-link" to={item.path}>{item.name}</Link>
                        {item.sub && (
                          <ul className="Nav-dropdown">
                            {item.sub.map((sub, idx) => (
                              <li key={idx}><Link to={sub.path}>{sub.name}</Link></li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </nav>

        {/* ===== Mobile Menu ===== */}
        <div className={`Nav-mobile-menu ${mobileMenuOpen ? "open" : ""}`} ref={menuRef}>
          <div className="Nav-mobile-wrapper">
            <div className="Nav-mobile-top">
              <div className="Nav-mobile-logo"><img src={logo} alt="EduBlink" /></div>
              <button className="Nav-close" onClick={() => setMobileMenuOpen(false)}>✕</button>
            </div>
            <ul className="Nav-mobile-list">
              {menuItems.map((item, i) => (
                <li key={i}>
                  {item.name === "Get a Quote" ? (
                    <Link
                      to={item.path}
                      className="Nav-mobile-donate-btn"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : item.sub ? (
                    <>
                      <div
                        className="mobile-link"
                        onClick={() => toggleDropdown(i)}
                      >
                        {item.name}{" "}
                        <span className="nav-arrow">
                          {mobileDropdownOpen === i ? "▲" : "▼"}
                        </span>
                      </div>
                      <ul
                        className={`mobile-dropdown ${
                          mobileDropdownOpen === i ? "open" : ""
                        }`}
                      >
                        {item.sub.map((sub, idx) => (
                          <li key={idx}>
                            <Link
                              to={sub.path}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    // ✅ Fix: Direct route for normal links (like Contact Us, Blog, Home, etc.)
                    <Link
                      to={item.path}
                      className="mobile-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

          </div>
        </div>
        
      </header>
    </>
  );
};

export default Navbar;
