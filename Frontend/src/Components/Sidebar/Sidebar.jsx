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
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { API_URL } from "../../Api";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEventDropdownOpen, setIsEventDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleEventDropdown = () => {
    setIsEventDropdownOpen(!isEventDropdownOpen);
  };

  return (
    <>
      <button className="menu-button" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar-container ${isOpen ? "open" : ""}`}>
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
              <p className="sidebar-user-info">📧 Email: {user.email}</p>
              <p className="sidebar-user-info">⏳ Last Login: {user.lastLogin || "Never Logged In"}</p>
            </>
          ) : (
            <p className="sidebar-user-info">Loading user data...</p>
          )}
        </div>

        <nav className="sidebar-nav">
          {/* Unique Records Section with Dropdown */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title" onClick={toggleDropdown}>
              <FaTrophy /> Unique Records
              {isDropdownOpen ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}
            </h4>

            {isDropdownOpen && (
              <div className={`sidebar-dropdown ${isDropdownOpen ? "open" : ""}`}>
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
            )}
          </div>

          {/* Event Registration Section with Dropdown */}
          <div className="sidebar-section">
            <h4 className="sidebar-section-title" onClick={toggleEventDropdown}>
              <FaCalendarCheck /> Event Registration
              {isEventDropdownOpen ? <FaChevronUp className="dropdown-icon" /> : <FaChevronDown className="dropdown-icon" />}
            </h4>

            {isEventDropdownOpen && (
              <div className={`sidebar-dropdown ${isEventDropdownOpen ? "open" : ""}`}>
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
            )}
          </div>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </>
  );
};

export default Sidebar;