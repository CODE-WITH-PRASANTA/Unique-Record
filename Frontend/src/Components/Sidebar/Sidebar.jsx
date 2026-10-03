import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [openSections, setOpenSections] = useState({
    uniqueRecords: true,
    eventRegistration: true,
  });

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

          {/* Profile */}
          <div className="ur-profile-section">
            <div className="ur-profile-image-wrapper">
              <div className="ur-profile-image">
                <UserRound size={58} strokeWidth={1.7} />
              </div>
              <span className="ur-online-dot"></span>
            </div>

            <h2 className="ur-profile-name">Ankita</h2>

            <div className="ur-profile-info">
              <div className="ur-info-row">
                <Hash size={14} />
                <span>Unique ID: 260S716799</span>
              </div>

              <div className="ur-info-row">
                <Mail size={14} />
                <span>Email: nayakankita554@gmail.com</span>
              </div>

              <div className="ur-info-row">
                <Clock3 size={14} />
                <span>Last Login: 29-09-2026 23:02:33</span>
              </div>
            </div>
          </div>

          <div className="ur-profile-divider"></div>

          {/* Navigation Links */}
          <nav className="ur-navigation">

            {/* ================= UNIQUE RECORDS ================= */}
            <div className="ur-menu-section">
              <button
                type="button"
                className={`ur-section-header ${
                  openSections.uniqueRecords ? "ur-section-active" : ""
                }`}
                onClick={() => toggleSection("uniqueRecords")}
              >
                <div className="ur-section-title">
                  <Trophy size={21} />
                  <span>Unique Records</span>
                </div>
                {openSections.uniqueRecords ? <ChevronUp size={21} /> : <ChevronDown size={21} />}
              </button>

              <div className={`ur-submenu ${openSections.uniqueRecords ? "ur-submenu-open" : ""}`}>
                <NavLink
                  to="/uru/apply"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `ur-submenu-item ${isActive ? "ur-submenu-active" : ""}`}
                >
                  <FileText size={17} />
                  <span>Apply for "URU" Holder</span>
                </NavLink>

                <NavLink
                  to="/uru/application-status"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `ur-submenu-item ${isActive ? "ur-submenu-active" : ""}`}
                >
                  <ClipboardList size={17} />
                  <span>Application Status</span>
                </NavLink>

                <NavLink
                  to="/uru/download-certificate"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `ur-submenu-item ${isActive ? "ur-submenu-active" : ""}`}
                >
                  <Download size={17} />
                  <span>Download Certificate</span>
                </NavLink>
              </div>
            </div>

            {/* ================= EVENT REGISTRATION ================= */}
            <div className="ur-menu-section">
              <button
                type="button"
                className={`ur-section-header ${
                  openSections.eventRegistration ? "ur-section-active" : ""
                }`}
                onClick={() => toggleSection("eventRegistration")}
              >
                <div className="ur-section-title">
                  <CalendarCheck size={21} />
                  <span>Event Registration</span>
                </div>
                {openSections.eventRegistration ? <ChevronUp size={21} /> : <ChevronDown size={21} />}
              </button>

              <div className={`ur-submenu ${openSections.eventRegistration ? "ur-submenu-open" : ""}`}>
                <NavLink
                  to="/event/register"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `ur-submenu-item ${isActive ? "ur-submenu-active" : ""}`}
                >
                  <ClipboardCheck size={17} />
                  <span>Register for Event</span>
                </NavLink>

                <NavLink
                  to="/event/registration-status"
                  onClick={closeMobileSidebar}
                  className={({ isActive }) => `ur-submenu-item ${isActive ? "ur-submenu-active" : ""}`}
                >
                  <ClipboardList size={17} />
                  <span>Registration Status</span>
                </NavLink>
              </div>
            </div>

          </nav>

          {/* Logout Footer */}
          <div className="ur-sidebar-footer">
            <button className="ur-logout-btn" onClick={handleLogout} type="button">
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