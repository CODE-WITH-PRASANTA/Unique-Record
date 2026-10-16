import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
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
  FiX,
  FiChevronDown,
} from "react-icons/fi";
import { FaRegNewspaper } from "react-icons/fa";

import "./Navbar.css";
import logo from "../../assets/UNQUE.png";

const MOBILE_BREAKPOINT = 1180;

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
  { name: "Contact", path: "/contact", icon: <FiPhone />, cta: true },
];

const Navbar = () => {
  const [isFixed, setIsFixed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(null);
  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(null);

  const placeholderRef = useRef(null);
  const menuRef = useRef(null);
  const togglerRef = useRef(null);
  const desktopMenuRef = useRef(null);
  const location = useLocation();

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileDropdownOpen(null);
  }, []);

  const toggleMobileDropdown = (index) => {
    setMobileDropdownOpen((current) => (current === index ? null : index));
  };

  const isGroupActive = (item) =>
    item.sub?.some((sub) => location.pathname.startsWith(sub.path));

  /*
    Fixed-on-scroll: the placeholder stays in the normal page flow (keeps the
    navbar's height so nothing jumps). When it reaches the top of the screen,
    the topbar has fully scrolled away and the navbar becomes fixed.
    This works no matter which parent element wraps <Navbar />.
  */
  useEffect(() => {
    const updateFixed = () => {
      if (!placeholderRef.current) return;
      setIsFixed(placeholderRef.current.getBoundingClientRect().top <= 0);
    };

    updateFixed();
    window.addEventListener("scroll", updateFixed, { passive: true });
    window.addEventListener("resize", updateFixed);
    window.addEventListener("load", updateFixed);

    return () => {
      window.removeEventListener("scroll", updateFixed);
      window.removeEventListener("resize", updateFixed);
      window.removeEventListener("load", updateFixed);
    };
  }, []);

  /* Close menus on route change */
  useEffect(() => {
    closeMobileMenu();
    setDesktopDropdownOpen(null);
  }, [location.pathname, closeMobileMenu]);

  /* Outside click (mobile drawer + desktop dropdown) */
  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !togglerRef.current?.contains(event.target)
      ) {
        closeMobileMenu();
      }

      if (
        desktopMenuRef.current &&
        !desktopMenuRef.current.contains(event.target)
      ) {
        setDesktopDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, {
      passive: true,
    });
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [mobileMenuOpen, closeMobileMenu]);

  /* Escape key */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMobileMenu();
        setDesktopDropdownOpen(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeMobileMenu]);

  /* Close drawer when screen grows to desktop */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) closeMobileMenu();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [closeMobileMenu]);

  /* Lock body scroll while drawer is open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <div className="Navbar-placeholder" ref={placeholderRef}>
      <header className={`Navbar-wrapper ${isFixed ? "Navbar-fixed" : ""}`}>
        <nav className="Navbar-nav" aria-label="Main navigation">
          <div className="Navbar-container Navbar-inner">
            {/* Logo */}
            <Link to="/" className="Navbar-logo" onClick={closeMobileMenu}>
              <img src={logo} alt="URU Logo" />
            </Link>

            {/* Desktop Navigation */}
            <ul className="Navbar-menu" ref={desktopMenuRef}>
              {menuItems.map((item, index) => (
                <li
                  className={`Navbar-item ${item.sub ? "Navbar-has-dropdown" : ""} ${
                    desktopDropdownOpen === index ? "Navbar-dropdown-open" : ""
                  }`}
                  key={item.name}
                  onMouseEnter={() => item.sub && setDesktopDropdownOpen(index)}
                  onMouseLeave={() => item.sub && setDesktopDropdownOpen(null)}
                >
                  {item.sub ? (
                    <>
                      <button
                        type="button"
                        className={`Navbar-link Navbar-dropdown-trigger ${
                          isGroupActive(item) ? "Navbar-active" : ""
                        }`}
                        aria-haspopup="true"
                        aria-expanded={desktopDropdownOpen === index}
                        onClick={() =>
                          setDesktopDropdownOpen((current) =>
                            current === index ? null : index
                          )
                        }
                      >
                        {item.name}
                        <FiChevronDown className="Navbar-chevron" />
                      </button>

                      <ul className="Navbar-dropdown">
                        {item.sub.map((sub) => (
                          <li key={sub.path}>
                            <NavLink
                              to={sub.path}
                              className={({ isActive }) =>
                                `Navbar-dropdown-link ${
                                  isActive ? "Navbar-active" : ""
                                }`
                              }
                            >
                              <span className="Navbar-sub-icon">{sub.icon}</span>
                              {sub.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) =>
                        `Navbar-link ${item.cta ? "Navbar-cta" : ""} ${
                          isActive ? "Navbar-active" : ""
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}
                </li>
              ))}
            </ul>

            {/* Mobile Toggle */}
            <button
              type="button"
              ref={togglerRef}
              className={`Navbar-toggler ${mobileMenuOpen ? "Navbar-toggler-open" : ""}`}
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              aria-controls="Navbar-mobile-menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </nav>

        {/* Mobile Overlay */}
        <div
          className={`Navbar-overlay ${mobileMenuOpen ? "Navbar-visible" : ""}`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        />

        {/* Mobile Drawer */}
        <aside
          id="Navbar-mobile-menu"
          className={`Navbar-mobile-menu ${mobileMenuOpen ? "Navbar-open" : ""}`}
          ref={menuRef}
          aria-label="Mobile navigation"
          aria-hidden={!mobileMenuOpen}
        >
          <div className="Navbar-mobile-top">
            <Link
              to="/"
              className="Navbar-mobile-logo"
              onClick={closeMobileMenu}
            >
              <img src={logo} alt="URU Logo" />
            </Link>

            <button
              type="button"
              className="Navbar-close"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
            >
              <FiX />
            </button>
          </div>

          <ul className="Navbar-mobile-list">
            {menuItems.map((item, index) => (
              <li className="Navbar-mobile-item" key={item.name}>
                {item.sub ? (
                  <>
                    <button
                      type="button"
                      className={`Navbar-mobile-link Navbar-mobile-trigger ${
                        isGroupActive(item) ? "Navbar-mobile-active" : ""
                      }`}
                      onClick={() => toggleMobileDropdown(index)}
                      aria-expanded={mobileDropdownOpen === index}
                    >
                      <span className="Navbar-mobile-link-content">
                        <span className="Navbar-mobile-icon">{item.icon}</span>
                        {item.name}
                      </span>
                      <FiChevronDown
                        className={`Navbar-arrow ${
                          mobileDropdownOpen === index ? "Navbar-rotated" : ""
                        }`}
                      />
                    </button>

                    <div
                      className={`Navbar-mobile-dropdown ${
                        mobileDropdownOpen === index ? "Navbar-open" : ""
                      }`}
                    >
                      <ul className="Navbar-mobile-dropdown-list">
                        {item.sub.map((sub) => (
                          <li key={sub.path}>
                            <NavLink
                              to={sub.path}
                              className={({ isActive }) =>
                                `Navbar-mobile-sublink ${
                                  isActive ? "Navbar-mobile-active" : ""
                                }`
                              }
                              onClick={closeMobileMenu}
                              tabIndex={mobileDropdownOpen === index ? 0 : -1}
                            >
                              <span className="Navbar-mobile-icon">
                                {sub.icon}
                              </span>
                              {sub.name}
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `Navbar-mobile-link ${item.cta ? "Navbar-mobile-cta" : ""} ${
                        isActive ? "Navbar-mobile-active" : ""
                      }`
                    }
                    onClick={closeMobileMenu}
                  >
                    <span className="Navbar-mobile-link-content">
                      <span className="Navbar-mobile-icon">{item.icon}</span>
                      {item.name}
                    </span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </aside>
      </header>
    </div>
  );
};

export default Navbar;