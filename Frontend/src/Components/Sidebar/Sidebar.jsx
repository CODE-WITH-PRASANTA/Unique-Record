import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import "./Sidebar.css";
import profileImg from "../../assets/profile-pic.png";
import {
  FaBars, FaTimes, FaFileAlt, FaEdit, FaDownload, FaTrophy,
  FaCalendarCheck, FaUserEdit, FaClipboardList, FaSignOutAlt
} from "react-icons/fa";
import { API_URL } from "../../Api"; // Import API URL


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found in localStorage");
        navigate("/login");
        return;
      }

      console.log("Token being sent:", token);

      await axios.post(
        `${API_URL}/auth/logout`, // Use API_URL here
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);
    }
  };
  
  
  

  return (
    <>
      {/* Menu Button for Mobile */}
      <button className="menu-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
        {/* Profile Section */}
        <div className="sidebar-profile">
          <img src={profileImg} alt="Profile" className="sidebar-profile-img" />
          <h3 className="sidebar-username">Prasant Kumar Khuntia</h3>
          <p className="sidebar-user-info">🔹 Unique ID: 23OS48943072</p>
          <p className="sidebar-user-info">⏳ Last Login: 21-03-2025 13:38:06</p>
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {/* Unique Records Section */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title"><FaTrophy /> Unique Records</h4>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "sidebar-active" : ""}>
              <FaFileAlt /> Apply for "URU" Holder
            </Link>
            <Link to="#" className={location.pathname === "/application-status" ? "sidebar-active" : ""}>
              <FaClipboardList /> Application Status
            </Link>
            <Link to="#" className={location.pathname === "/edit-application" ? "sidebar-active" : ""}>
              <FaEdit /> Edit Application Form
            </Link>
            <Link to="#" className={location.pathname === "/download-application" ? "sidebar-active" : ""}>
              <FaDownload /> Download Application Form
            </Link>
          </div>

          {/* Event Registration Section */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title"><FaCalendarCheck /> Event Registration</h4>
            <Link to="/dashboard/event-registration" className={location.pathname === "/dashboard/event-registration" ? "sidebar-active" : ""}>
              <FaClipboardList /> Register for Event
            </Link>
            <Link to="#" className={location.pathname === "/event-status" ? "sidebar-active" : ""}>
              <FaClipboardList /> Registration Status
            </Link>
            <Link to="#" className={location.pathname === "/edit-event" ? "sidebar-active" : ""}>
              <FaUserEdit /> Edit Event Form
            </Link>
            <Link to="#" className={location.pathname === "/download-event" ? "sidebar-active" : ""}>
              <FaDownload /> Download Event Form
            </Link>
          </div>
        </nav>

        {/* ✅ Logout Button */}
        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;
