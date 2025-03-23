import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import profileImg from "../../assets/diffult-profile-pic.png";
import {
  FaBars,
  FaTimes,
  FaFileAlt,
  FaEdit,
  FaDownload,
  FaTrophy,
  FaCalendarCheck,
  FaUserEdit,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import { API_URL } from "../../Api"; // API Base URL

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(profileImg);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_URL}/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
      } catch (error) {
        console.error(
          "Error fetching user details:",
          error.response?.data?.message || error.message
        );

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };




  // ✅ Sidebar Toggle Function
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
  <label htmlFor="profile-picture-upload">
    <img
      src={profilePicturePreview}
      alt="Profile"
      className="sidebar-profile-img"
    />
  </label>
  {user ? (
    <>
      <h3 className="sidebar-username">{user.fullName}</h3>
      <p className="sidebar-user-info">🔹 Unique ID: {user.uniqueId}</p>
      <p className="sidebar-user-info">📧 Email: {user.email}</p> {/* Display Email */}
      <p className="sidebar-user-info">⏳ Last Login: {user.lastLogin || "Never Logged In"}</p>
    </>
  ) : (
    <p className="sidebar-user-info">Loading user data...</p>
  )}
</div>


        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {/* Unique Records Section */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title"><FaTrophy /> Unique Records</h4>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "sidebar-active" : ""}>
              <FaFileAlt /> Apply for "URU" Holder
            </Link>
            <Link to="/application-status" className={location.pathname === "/application-status" ? "sidebar-active" : ""}>
              <FaClipboardList /> Application Status
            </Link>
            <Link to="/edit-application" className={location.pathname === "/edit-application" ? "sidebar-active" : ""}>
              <FaEdit /> Edit Application Form
            </Link>
            <Link to="/download-application" className={location.pathname === "/download-application" ? "sidebar-active" : ""}>
              <FaDownload /> Download Application Form
            </Link>
          </div>

          {/* Event Registration Section */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title"><FaCalendarCheck /> Event Registration</h4>
            <Link to="/dashboard/event-registration" className={location.pathname === "/dashboard/event-registration" ? "sidebar-active" : ""}>
              <FaClipboardList /> Register for Event
            </Link>
            <Link to="/event-status" className={location.pathname === "/event-status" ? "sidebar-active" : ""}>
              <FaClipboardList /> Registration Status
            </Link>
            <Link to="/edit-event" className={location.pathname === "/edit-event" ? "sidebar-active" : ""}>
              <FaUserEdit /> Edit Event Form
            </Link>
            <Link to="/download-event" className={location.pathname === "/download-event" ? "sidebar-active" : ""}>
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
