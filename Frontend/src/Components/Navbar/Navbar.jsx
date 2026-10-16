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
  FiChevronDown,
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

  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || localStorage.getItem("authToken");
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const currentToken = localStorage.getItem("token") || localStorage.getItem("authToken");
      setToken(currentToken);
      try {
        const stored = localStorage.getItem("user");
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAuthenticated");
    setUser(null);
    setToken(null);
    window.location.href = "/login";
  };

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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const toggleDropdown = (index) => {
    setMobileDropdownOpen(mobileDropdownOpen === index ? null : index);
  };

  // ✅ Updated Menu Items (without Donate/Login)
const menuItems = [
  { name: "Home", path: "/", icon: <FiHome /> },
  { name: "About Us", path: "/about", icon: <FiInfo /> },
  { name: "Our Vision", path: "/vision", icon: <FiEye /> },
  { name: "Achievements", path: "/achivments", icon: <FiAward /> },
  { name: "URU Holder", path: "/achievers", icon: <FiStar /> },
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
            {token ? (
              <div className="topbar-auth-group">
                <Link to="/dashboard" className="topbar-login topbar-dashboard-link">
                  👤 {user?.fullName?.split(" ")[0] || "Dashboard"}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="topbar-logout-btn"
                >
                  🚪 Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="topbar-login">🔑 Login / Register</Link>
            )}
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
        </header>

        {/* ===== Mobile Menu Backdrop ===== */}
        <div 
          className={`Nav-mobile-backdrop ${mobileMenuOpen ? "open" : ""}`} 
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />

        {/* ===== Mobile Menu ===== */}
        <div className={`Nav-mobile-menu ${mobileMenuOpen ? "open" : ""}`} ref={menuRef}>
          <div className="Nav-mobile-wrapper">
            <div className="Nav-mobile-top">
              <div className="Nav-mobile-logo">
                <img src={logo} alt="URU Logo" />
              </div>
              <button 
                type="button"
                className="Nav-close" 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <ul className="Nav-mobile-list">
              {menuItems.map((item, i) => (
                <li key={i} className="Nav-mobile-item">
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
                        className={`mobile-link mobile-dropdown-toggle ${
                          mobileDropdownOpen === i ? "active" : ""
                        }`}
                        onClick={() => toggleDropdown(i)}
                      >
                        <span className="mobile-link-content">
                          {item.icon && (
                            <span className="mobile-link-icon">{item.icon}</span>
                          )}
                          <span className="mobile-link-text">{item.name}</span>
                        </span>
                        <span
                          className={`nav-arrow ${
                            mobileDropdownOpen === i ? "open" : ""
                          }`}
                        >
                          <FiChevronDown />
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
                              className="mobile-sublink"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.icon && (
                                <span className="mobile-sublink-icon">{sub.icon}</span>
                              )}
                              <span>{sub.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      to={item.path}
                      className="mobile-link"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="mobile-link-content">
                        {item.icon && (
                          <span className="mobile-link-icon">{item.icon}</span>
                        )}
                        <span className="mobile-link-text">{item.name}</span>
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Auth Section */}
            <div className="mobile-auth-section">
              {token ? (
                <>
                  <Link
                    to="/dashboard"
                    className="mobile-auth-btn mobile-dashboard-btn"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>👤 My Dashboard ({user?.fullName?.split(" ")[0] || "User"})</span>
                  </Link>
                  <button
                    type="button"
                    className="mobile-auth-btn mobile-logout-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <span>🚪 Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="mobile-auth-btn mobile-login-btn"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>🔑 Login / Register</span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </>
  );
};

export default Navbar;
