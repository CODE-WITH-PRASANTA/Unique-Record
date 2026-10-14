import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaFacebookF,
  FaWhatsapp,
  FaXTwitter,
  FaTelegram,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import { FaGraduationCap, FaHeart } from "react-icons/fa";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiLink,
  FiGrid,
  FiSend,
  FiChevronRight,
  FiBookOpen,
  FiDatabase,
  FiMessageSquare,
  FiShield,
  FiBell,
  FiGift,
  FiUsers,
  FiArrowRight,
  FiGlobe,
} from "react-icons/fi";

import footerlogo from "../../assets/UNQUE.png";
import { API_URL } from "../../Api";
import "./Footer.css";

/* ---------- Data ---------- */

const addresses = [
  "Jaihind Tendua, Aurangabad, Bihar",
  "Thekma, Azamgarh, Uttar Pradesh",
  "Nandgran, Una, Himachal Pradesh",
];

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Our Vision", path: "/vision" },
  { name: "Achievements", path: "/achivments" },
  { name: "URU Holder's", path: "/achievers" },
  { name: "Notice", path: "/notice" },
  { name: "Event Registration", path: "/event" },
  { name: "Media", path: "/media" },
  { name: "URU Post", path: "/blog" },
  { name: "FAQ", path: "/faq" },
  { name: "Contact", path: "/contact" },
];

const services = [
  {
    name: "Divya Prerak Kahaniyan™",
    url: "https://www.dpkavishek.in",
    icon: <FiBookOpen />,
    tone: "gold",
  },
  {
    name: "DBMS Online™",
    url: "https://www.dbmsonline.in",
    icon: <FiDatabase />,
    tone: "blue",
  },
  {
    name: "International Institute of Internship™",
    url: "https://ouruniverse.in/",
    icon: <FaGraduationCap />,
    tone: "purple",
  },
  {
    name: "Contact Us",
    path: "/contact",
    icon: <FiMessageSquare />,
    tone: "green",
  },
];

const features = [
  { label: "100% Secure", icon: <FiShield /> },
  { label: "Latest Updates", icon: <FiBell /> },
  { label: "Exclusive News", icon: <FiGift /> },
  { label: "Join Our Community", icon: <FiUsers /> },
];

/*
  Social links. "#" means "not set yet": replace it with your real page URL.
*/
const socials = [
  {
    name: "Facebook",
    brand: "facebook",
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/groups/637109025434460/",
  },
  {
    name: "Instagram",
    brand: "instagram",
    icon: <FaInstagram />,
    url: "https://ig.me/j/AbYpK-z9eMj7dSAv/",
  },
  {
    name: "Telegram",
    brand: "telegram",
    icon: <FaTelegram />,
    url: "https://t.me/+jsAV_YA1yXgyN2Q1",
  },
  {
    name: "WhatsApp",
    brand: "whatsapp",
    icon: <FaWhatsapp />,
    url: "https://chat.whatsapp.com/LrCIxNdOMdYDNOlFPA073k",
  },
  { name: "X (Twitter)", brand: "x", icon: <FaXTwitter />, url: "#" },
  { name: "YouTube", brand: "youtube", icon: <FaYoutube />, url: "#" },
];

const policyLinks = [
  { name: "Terms of Service", path: "/termandcondition" },
  { name: "Privacy Policy", path: "/termandcondition" },
  { name: "Refund Policy", path: "/termandcondition" },
  { name: "Delivery Info", path: "/termandcondition" },
];

/* Four-point sparkle used in the divider and tagline */
const Spark = () => (
  <svg className="Footer-spark" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0c.8 6.2 5.8 11.2 12 12-6.2.8-11.2 5.8-12 12-.8-6.2-5.8-11.2-12-12C6.2 11.2 11.2 6.2 12 0z" />
  </svg>
);

/* ---------- Component ---------- */

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleSubscribe = async (event) => {
    event.preventDefault();
    const value = email.trim();

    if (!value) {
      setStatus({ type: "error", text: "Please enter your email." });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(value)) {
      setStatus({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/newsletter/subscribe`, {
        email: value,
      });
      setStatus({
        type: "success",
        text: res.data?.message || "Thanks for subscribing!",
      });
      setEmail("");
    } catch (err) {
      setStatus({
        type: "error",
        text:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="Footer-wrapper">
      {/* ===== Background scenery (decorative) ===== */}
      <div className="Footer-bg" aria-hidden="true">
        <div className="Footer-stars"></div>
        <div className="Footer-planet Footer-planet-left"></div>
        <div className="Footer-planet Footer-planet-right"></div>

        <svg
          className="Footer-mountains"
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="Footer-mountain-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#0f2147" stopOpacity="0.85" />
              <stop offset="1" stopColor="#050c1d" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="Footer-mountain-front" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#060e22" />
              <stop offset="1" stopColor="#02050d" />
            </linearGradient>
          </defs>
          <path
            fill="url(#Footer-mountain-back)"
            d="M0 120 L70 96 L150 118 L240 62 L320 104 L420 74 L520 122 L620 84 L720 116 L830 58 L930 108 L1040 78 L1140 120 L1240 72 L1340 104 L1440 82 L1440 240 L0 240 Z"
          />
          <path
            fill="url(#Footer-mountain-front)"
            d="M0 168 L110 146 L210 170 L330 138 L450 174 L580 148 L700 178 L830 144 L960 176 L1090 142 L1210 172 L1330 140 L1440 164 L1440 240 L0 240 Z"
          />
        </svg>
      </div>

      <div className="Footer-main">
        <div className="Footer-container">
          <div className="Footer-grid">
            {/* ===== Brand ===== */}
            <div className="Footer-col Footer-brand">
              <Link to="/" className="Footer-logo-link" aria-label="Home">
                <img src={footerlogo} alt="URU Logo" className="Footer-logo" />
              </Link>

              <p className="Footer-tagline">
                <span className="Footer-tagline-gold">Digitally Marking</span>
                <span className="Footer-tagline-white">
                  The Extraordinary Achievement.
                </span>
              </p>

              <div className="Footer-tagline-divider" aria-hidden="true">
                <span></span>
                <Spark />
                <span></span>
              </div>

              <ul className="Footer-contact">
                {addresses.map((address) => (
                  <li className="Footer-contact-item" key={address}>
                    <span className="Footer-contact-icon">
                      <FiMapPin />
                    </span>
                    <span className="Footer-contact-text">{address}</span>
                  </li>
                ))}
                <li>
                  <a href="tel:+919472351693" className="Footer-contact-item">
                    <span className="Footer-contact-icon">
                      <FiPhone />
                    </span>
                    <span className="Footer-contact-text">+91 9472351693</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:uruonline2025@gmail.com"
                    className="Footer-contact-item"
                  >
                    <span className="Footer-contact-icon">
                      <FiMail />
                    </span>
                    <span className="Footer-contact-text">
                      uruonline2025@gmail.com
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* ===== Quick Links ===== */}
            <nav className="Footer-col Footer-quick" aria-label="Quick links">
              <h4 className="Footer-heading">
                <FiLink className="Footer-heading-icon" />
                <span className="Footer-heading-text">Quick Links</span>
              </h4>

              <ul className="Footer-links-list">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="Footer-link">
                      <span className="Footer-chevron">
                        <FiChevronRight />
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* ===== Useful Services ===== */}
            <div className="Footer-col Footer-services">
              <h4 className="Footer-heading">
                <FiGrid className="Footer-heading-icon" />
                <span className="Footer-heading-text">Useful Services</span>
              </h4>

              <ul className="Footer-service-list">
                {services.map((service) => {
                  const content = (
                    <>
                      <span
                        className={`Footer-service-icon Footer-tone-${service.tone}`}
                      >
                        {service.icon}
                      </span>
                      <span className="Footer-service-name">
                        {service.name}
                      </span>
                      <FiChevronRight className="Footer-service-arrow" />
                    </>
                  );

                  return (
                    <li key={service.name}>
                      {service.path ? (
                        <Link to={service.path} className="Footer-service">
                          {content}
                        </Link>
                      ) : (
                        <a
                          href={service.url}
                          className="Footer-service"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {content}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ===== Newsletter ===== */}
            <div className="Footer-col Footer-newsletter">
              <h4 className="Footer-heading">
                <FiSend className="Footer-heading-icon" />
                <span className="Footer-heading-text">Newsletter</span>
              </h4>

              <p className="Footer-news-text">
                Get weekly insights, updates, and inspiration directly to your
                inbox.
              </p>

              <form
                className="Footer-news-form"
                onSubmit={handleSubscribe}
                noValidate
              >
                <FiMail className="Footer-news-mail" aria-hidden="true" />
                <input
                  type="email"
                  className="Footer-news-input"
                  placeholder="Enter your email"
                  aria-label="Email address"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="Footer-subscribe"
                  disabled={loading}
                >
                  <span>{loading ? "Subscribing…" : "Subscribe"}</span>
                  <span className="Footer-subscribe-arrow">
                    <FiArrowRight />
                  </span>
                </button>
              </form>

              {status.text && (
                <p
                  className={`Footer-news-msg Footer-news-msg-${status.type}`}
                  role="status"
                  aria-live="polite"
                >
                  {status.text}
                </p>
              )}

              <ul className="Footer-features">
                {features.map((feature) => (
                  <li className="Footer-feature" key={feature.label}>
                    <span className="Footer-feature-icon">{feature.icon}</span>
                    <span className="Footer-feature-label">
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ===== Ornamental divider ===== */}
        <div className="Footer-divider" aria-hidden="true">
          <span className="Footer-divider-line Footer-divider-line-left"></span>
          <Spark />
          <span className="Footer-globe">
            <FiGlobe />
          </span>
          <Spark />
          <span className="Footer-divider-line Footer-divider-line-right"></span>
        </div>

        {/* ===== Bottom ===== */}
        <div className="Footer-bottom">
          <div className="Footer-social">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className={`Footer-social-link Footer-brand-${social.brand}`}
                aria-label={social.name}
                target={social.url === "#" ? undefined : "_blank"}
                rel="noopener noreferrer"
                onClick={(e) => social.url === "#" && e.preventDefault()}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <nav className="Footer-policy" aria-label="Legal">
            {policyLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="Footer-policy-link"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <p className="Footer-credit">
            © {new Date().getFullYear()}{" "}
            <span className="Footer-credit-blue">DPKHRC Trust</span>. Crafted
            with <FaHeart className="Footer-heart" aria-label="love" /> by{" "}
            <a
              href="https://prwebstock.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="Footer-credit-link"
            >
              PR Webstock
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;