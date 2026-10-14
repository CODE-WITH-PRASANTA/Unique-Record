import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiLogIn,
  FiLogOut,
  FiHeart,
} from "react-icons/fi";
import "./Topbar.css";

const PHONE_DISPLAY = "+91 - 94723 51693";
const PHONE_LINK = "tel:+919472351693";
const EMAIL = "uruonline2025@gmail.com";

const readToken = () =>
  localStorage.getItem("token") || localStorage.getItem("authToken");

const readUser = () => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const Topbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(readUser);
  const [token, setToken] = useState(readToken);

  const syncAuth = useCallback(() => {
    setToken(readToken());
    setUser(readUser());
  }, []);

  useEffect(() => {
    // "storage" fires for changes made in OTHER tabs.
    // After login/logout in the same tab, call:
    // window.dispatchEvent(new Event("authChange"));
    window.addEventListener("storage", syncAuth);
    window.addEventListener("authChange", syncAuth);
    window.addEventListener("focus", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("authChange", syncAuth);
      window.removeEventListener("focus", syncAuth);
    };
  }, [syncAuth]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAuthenticated");

    setUser(null);
    setToken(null);

    navigate("/login", { replace: true });
  };

  const firstName = user?.fullName?.trim().split(" ")[0] || "Dashboard";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="Topbar-wrapper">
      <div className="Topbar-container">
        <div className="Topbar-content">
          {/* Left: contact */}
          <div className="Topbar-left">
            <a
              href={PHONE_LINK}
              className="Topbar-item"
              aria-label={`Call ${PHONE_DISPLAY}`}
            >
              <span className="Topbar-icon">
                <FiPhone />
              </span>
              <span className="Topbar-item-text">{PHONE_DISPLAY}</span>
            </a>

            <span className="Topbar-divider" aria-hidden="true"></span>

            <a
              href={`mailto:${EMAIL}`}
              className="Topbar-item Topbar-item-email"
              aria-label={`Email ${EMAIL}`}
            >
              <span className="Topbar-icon">
                <FiMail />
              </span>
              <span className="Topbar-item-text">{EMAIL}</span>
            </a>
          </div>

          {/* Right: auth + donate */}
          <div className="Topbar-right">
            {token ? (
              <div className="Topbar-auth-group">
                <Link
                  to="/dashboard"
                  className="Topbar-login Topbar-dashboard-link"
                  aria-label="Open dashboard"
                >
                  <span className="Topbar-avatar" aria-hidden="true">
                    {initial}
                  </span>
                  <span className="Topbar-btn-text Topbar-username">
                    {firstName}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="Topbar-logout-btn"
                  aria-label="Log out"
                >
                  <FiLogOut className="Topbar-btn-icon" />
                  <span className="Topbar-btn-text">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="Topbar-login"
                aria-label="Login or register"
              >
                <FiLogIn className="Topbar-btn-icon" />
                <span className="Topbar-btn-text">
                  Login
                  <span className="Topbar-extra"> / Register</span>
                </span>
              </Link>
            )}

            <Link to="/donate" className="Topbar-cta" aria-label="Donate">
              <FiHeart className="Topbar-btn-icon" />
              <span className="Topbar-btn-text">Donate</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;