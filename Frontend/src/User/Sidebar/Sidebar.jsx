import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../Api";
import {
  UserRound,
  Trophy,
  ChevronDown,
  ChevronUp,
  FileText,
  ClipboardList,
  Download,
  CalendarCheck,
  ClipboardCheck,
  LogOut,
  Menu,
  X,
  Hash,
  Mail,
  Clock3,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [openSections, setOpenSections] = useState({
    uniqueRecords: true,
    eventRegistration: true,
  });

  // Dynamic Logged-in User State from localStorage & API
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Fetch updated user details on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token") || localStorage.getItem("authToken");
        if (token) {
          const res = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data?.user || res.data?.fullName) {
            const userData = res.data.user || res.data;
            setCurrentUser((prev) => ({ ...prev, ...userData }));
            localStorage.setItem("user", JSON.stringify({ ...currentUser, ...userData }));
          }
        }
      } catch (err) {
        console.warn("Could not refresh user profile from server:", err.message);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("isAuthenticated");

    window.location.href = "/login";
  };

  const userName = currentUser?.fullName || currentUser?.name || "User";
  const userUniqueId = currentUser?.uniqueId || currentUser?.userId || "26OS000000";
  const userEmail = currentUser?.email || "user@gmail.com";
  const userLastLogin = currentUser?.lastLogin || new Date().toLocaleString();

  return (
    <>
      {/* Mobile Header */}
      <div className="ur-mobile-header">
        <button
          className="ur-mobile-menu-btn"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={23} />
        </button>

        <div className="ur-mobile-title">
          <span>Unique Records</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="ur-sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`ur-sidebar ${
          isMobileOpen ? "ur-sidebar-mobile-open" : ""
        }`}
      >
        {/* Mobile Close Button */}
        <button
          className="ur-mobile-close"
          onClick={closeMobileSidebar}
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>

        <div className="ur-sidebar-inner">

          {/* Dynamic Profile Section */}
          <div className="ur-profile-section">
            <div className="ur-profile-image-wrapper">
              <div className="ur-profile-image">
                <UserRound size={58} strokeWidth={1.7} />
              </div>

              <span className="ur-online-dot"></span>
            </div>

            <h2 className="ur-profile-name">{userName}</h2>

            <div className="ur-profile-info">
              <div className="ur-info-row">
                <Hash size={14} />
                <span>Unique ID: {userUniqueId}</span>
              </div>

              <div className="ur-info-row">
                <Mail size={14} />
                <span>Email: {userEmail}</span>
              </div>

              <div className="ur-info-row">
                <Clock3 size={14} />
                <span>Last Login: {userLastLogin}</span>
              </div>
            </div>
          </div>

          <div className="ur-profile-divider"></div>

          {/* Navigation */}
          <nav className="ur-navigation">

            {/* ================= UNIQUE RECORDS ================= */}
            <div className="ur-menu-section">

              <button
                className={`ur-section-header ${
                  openSections.uniqueRecords
                    ? "ur-section-active"
                    : ""
                }`}
                onClick={() => toggleSection("uniqueRecords")}
              >
                <div className="ur-section-title">
                  <Trophy size={21} />
                  <span>Unique Records</span>
                </div>

                {openSections.uniqueRecords ? (
                  <ChevronUp size={21} />
                ) : (
                  <ChevronDown size={21} />
                )}
              </button>

              <div
                className={`ur-submenu ${
                  openSections.uniqueRecords
                    ? "ur-submenu-open"
                    : ""
                }`}
              >
                <NavLink
                  to="/uru/apply"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `ur-submenu-item ${
                      isActive ? "ur-submenu-active" : ""
                    }`
                  }
                >
                  <FileText size={17} />
                  <span>Apply for "URU" Holder</span>
                </NavLink>

                <NavLink
                  to="/uru/application-status"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `ur-submenu-item ${
                      isActive ? "ur-submenu-active" : ""
                    }`
                  }
                >
                  <ClipboardList size={17} />
                  <span>Application Status</span>
                </NavLink>

                <NavLink
                  to="/uru/download-certificate"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `ur-submenu-item ${
                      isActive ? "ur-submenu-active" : ""
                    }`
                  }
                >
                  <Download size={17} />
                  <span>Download Certificate</span>
                </NavLink>
              </div>
            </div>

            {/* ================= EVENT REGISTRATION ================= */}
            <div className="ur-menu-section">

              <button
                className={`ur-section-header ${
                  openSections.eventRegistration
                    ? "ur-section-active"
                    : ""
                }`}
                onClick={() => toggleSection("eventRegistration")}
              >
                <div className="ur-section-title">
                  <CalendarCheck size={21} />
                  <span>
                    Event
                    <br />
                    Registration
                  </span>
                </div>

                {openSections.eventRegistration ? (
                  <ChevronUp size={21} />
                ) : (
                  <ChevronDown size={21} />
                )}
              </button>

              <div
                className={`ur-submenu ${
                  openSections.eventRegistration
                    ? "ur-submenu-open"
                    : ""
                }`}
              >
                <NavLink
                  to="/event/register"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `ur-submenu-item ${
                      isActive ? "ur-submenu-active" : ""
                    }`
                  }
                >
                  <ClipboardCheck size={17} />
                  <span>Register for Event</span>
                </NavLink>

                <NavLink
                  to="/event/registration-status"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) =>
                    `ur-submenu-item ${
                      isActive ? "ur-submenu-active" : ""
                    }`
                  }
                >
                  <ClipboardList size={17} />
                  <span>Registration Status</span>
                </NavLink>
              </div>
            </div>

          </nav>

          {/* Logout */}
          <div className="ur-sidebar-footer">
            <button
              className="ur-logout-btn"
              onClick={handleLogout}
            >
              <LogOut size={21} />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;