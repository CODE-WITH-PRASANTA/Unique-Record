import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  Home,
  FileText,
  Bell,
  Calendar,
  Users,
  HeartHandshake,
  Image as ImageIcon,
  Video,
  ThumbsUp,
  CheckSquare,
  Award,
  Layers,
  MessageSquare,
  Mail,
  ChevronDown,
  ChevronRight,
  PenTool,
  FolderKanban,
  PlusCircle,
  Edit3,
  UserPlus,
  UserCheck,
} from "lucide-react";

import "./Sidebar.css";

const Sidebar = ({
  isCollapsed = false,
  isMobileOpen = false,
  onToggleCollapse = () => {},
  onProfileClick = () => {},
  brandName = "URU Admin Panel",
  brandTagline = "Manage Records & Content",
  user = {
    name: "Admin",
    role: "Super Administrator",
    initials: "AD",
    avatarUrl: "",
  },
  version = "v1.0.0",
}) => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (title) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const menuItems = [
    // =====================================================
    // DASHBOARD
    // =====================================================
    {
      type: "link",
      icon: <Home size={19} strokeWidth={2} />,
      text: "Dashboard",
      path: "/",
      primary: true,
    },

    // =====================================================
    // BLOG SECTION
    // =====================================================
    {
      type: "section-heading",
      text: "Blog Section",
    },
    {
      type: "dropdown",
      icon: <FileText size={19} strokeWidth={2} />,
      text: "Blogs",
      subItems: [
        {
          text: "Create Blog",
          path: "/blogs/create",
          icon: <PenTool size={16} strokeWidth={2} />,
        },
        {
          text: "Manage Blogs",
          path: "/blogs/manage",
          icon: <FolderKanban size={16} strokeWidth={2} />,
        },
      ],
    },

    // =====================================================
    // NOTICE SECTION
    // =====================================================
    {
      type: "section-heading",
      text: "Notice Section",
    },
    {
      type: "dropdown",
      icon: <Bell size={19} strokeWidth={2} />,
      text: "Notices",
      subItems: [
        {
          text: "Add Notice",
          path: "/notices/add",
          icon: <PlusCircle size={16} strokeWidth={2} />,
        },
       
      ],
    },

    // =====================================================
    // EVENT SECTION
    // =====================================================
    {
      type: "section-heading",
      text: "Event Section",
    },
    {
      type: "dropdown",
      icon: <Calendar size={19} strokeWidth={2} />,
      text: "Events",
      subItems: [
        {
          text: "Add Event",
          path: "/events/add",
          icon: <PlusCircle size={16} strokeWidth={2} />,
        },
     
      ],
    },

    // =====================================================
    // TEAM SECTION
    // =====================================================
    {
      type: "section-heading",
      text: "Team Section",
    },
    {
      type: "dropdown",
      icon: <Users size={19} strokeWidth={2} />,
      text: "Team",
      subItems: [
        {
          text: "Add Member",
          path: "/team/add",
          icon: <UserPlus size={16} strokeWidth={2} />,
        },
       
      ],
    },

    // =====================================================
    // DONATIONS
    // =====================================================
    {
      type: "section-heading",
      text: "Donations",
    },
    {
      type: "link",
      icon: <HeartHandshake size={19} strokeWidth={2} />,
      text: "Manage Donations",
      path: "/donations/manage",
    },

    // =====================================================
    // MEDIA
    // =====================================================
    {
      type: "section-heading",
      text: "Media",
    },
    {
      type: "dropdown",
      icon: <ImageIcon size={19} strokeWidth={2} />,
      text: "Gallery",
      subItems: [
        {
          text: "Event Gallery",
          path: "/gallery/events",
          icon: <ImageIcon size={16} strokeWidth={2} />,
        },
       
      ],
    },
    {
      type: "dropdown",
      icon: <Video size={19} strokeWidth={2} />,
      text: "Media Manage",
      subItems: [
        {
          text: "YouTube Videos",
          path: "/media/youtube",
          icon: <Video size={16} strokeWidth={2} />,
        },
        {
          text: "Photos",
          path: "/media/photos",
          icon: <ImageIcon size={16} strokeWidth={2} />,
        },
      ],
    },

    // =====================================================
    // URU SECTION
    // =====================================================
    {
      type: "section-heading",
      text: "URU Section",
    },
    {
      type: "link",
      icon: <ThumbsUp size={19} strokeWidth={2} />,
      text: "Manage URU",
      path: "/uru/manage",
    },
    {
      type: "link",
      icon: <CheckSquare size={19} strokeWidth={2} />,
      text: "Approve URU",
      path: "/uru/approve",
    },
    {
      type: "link",
      icon: <CheckSquare size={19} strokeWidth={2} />,
      text: "Final URU",
      path: "/uru/final",
    },

    // =====================================================
    // ACHIEVEMENTS
    // =====================================================
    {
      type: "section-heading",
      text: "Achievements",
    },
    {
      type: "dropdown",
      icon: <Award size={19} strokeWidth={2} />,
      text: "Achievements",
      subItems: [
        {
          text: "Post Achievement",
          path: "/achievements/post",
          icon: <PlusCircle size={16} strokeWidth={2} />,
        },
        
       
      ],
    },

    // =====================================================
    // CATEGORIES
    // =====================================================
    {
      type: "section-heading",
      text: "Categories",
    },
    {
      type: "link",
      icon: <Layers size={19} strokeWidth={2} />,
      text: "Manage Categories",
      path: "/categories/manage",
    },

    // =====================================================
    // COMMENTS
    // =====================================================
    {
      type: "section-heading",
      text: "Comments",
    },
    {
      type: "dropdown",
      icon: <MessageSquare size={19} strokeWidth={2} />,
      text: "Comments",
      subItems: [
        {
          text: "Blog Comments",
          path: "/comments/blogs",
          icon: <MessageSquare size={16} strokeWidth={2} />,
        },
        {
          text: "Achievement Comments",
          path: "/comments/achievements",
          icon: <MessageSquare size={16} strokeWidth={2} />,
        },
      ],
    },

    // =====================================================
    // USERS
    // =====================================================
    {
      type: "section-heading",
      text: "Users",
    },
    {
      type: "link",
      icon: <MessageSquare size={19} strokeWidth={2} />,
      text: "User Opinions",
      path: "/users/opinions",
    },
    {
      type: "link",
      icon: <Mail size={19} strokeWidth={2} />,
      text: "Subscribed Newsletter",
      path: "/users/newsletter",
    },
  ];

  return (
    <aside
      className={`Sidebar ${isCollapsed ? "collapsed" : ""} ${
        isMobileOpen ? "mobile-open" : ""
      }`}
    >
      {/* ==========================================
          BACKGROUND SHEEN
      ========================================== */}
      <div className="Sidebar-sheen" aria-hidden="true" />

      {/* ==========================================
          BRAND HEADER
      ========================================== */}
      <div className="Sidebar-logo">
        <div className="Sidebar-logo-iconWrap">
          <div className="Sidebar-logo-icon">
            <ThumbsUp size={21} strokeWidth={2.3} />
          </div>
        </div>

        {!isCollapsed && (
          <div className="Sidebar-logo-text-group">
            <span className="Sidebar-logo-text">{brandName}</span>

            <span className="Sidebar-logo-tagline">
              {brandTagline}
            </span>
          </div>
        )}
      </div>

      {/* ==========================================
          PROFILE CARD
      ========================================== */}
      <button
        type="button"
        className="Sidebar-profile"
        onClick={onProfileClick}
      >
        <span className="Sidebar-profile-avatar">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
            />
          ) : (
            <span>
              {user.initials ||
                user.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
            </span>
          )}
        </span>

        {!isCollapsed && (
          <>
            <span className="Sidebar-profile-info">
              <span className="Sidebar-profile-name">
                {user.name}
              </span>

              <span className="Sidebar-profile-role">
                {user.role}
              </span>

              <span className="Sidebar-profile-online">
                <i />
                Online
              </span>
            </span>

            <ChevronDown
              size={15}
              className="Sidebar-profile-chevron"
            />
          </>
        )}
      </button>

      {/* ==========================================
          NAVIGATION
      ========================================== */}
      <nav className="Sidebar-nav">
        {menuItems.map((item, index) => {
          /* ========================================
             SECTION HEADING
          ======================================== */
          if (item.type === "section-heading") {
            return (
              <div
                key={index}
                className="Sidebar-section-wrapper"
              >
                {!isCollapsed && (
                  <span className="Sidebar-section-title">
                    {item.text}
                  </span>
                )}
              </div>
            );
          }

          /* ========================================
             NORMAL LINK
          ======================================== */
          if (item.type === "link") {
            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === "/"}
                title={isCollapsed ? item.text : undefined}
                className={({ isActive }) =>
                  `Sidebar-link ${
                    item.primary ? "primary" : ""
                  } ${
                    isActive && !item.primary
                      ? "active"
                      : ""
                  } ${
                    isActive && item.primary
                      ? "primary-active"
                      : ""
                  }`
                }
              >
                <span className="Sidebar-icon">
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <>
                    <span className="Sidebar-text">
                      {item.text}
                    </span>

                    {!item.primary && (
                      <ChevronRight
                        size={15}
                        className="Sidebar-chevron static"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          }

          /* ========================================
             DROPDOWN
          ======================================== */
          const isDropdownOpen =
            !!openDropdowns[item.text];

          return (
            <div
              key={index}
              className={`Sidebar-dropdown-wrapper ${
                isDropdownOpen ? "is-open" : ""
              }`}
            >
              <button
                type="button"
                onClick={() =>
                  !isCollapsed &&
                  toggleDropdown(item.text)
                }
                title={
                  isCollapsed
                    ? item.text
                    : undefined
                }
                className="Sidebar-link Sidebar-dropdown-toggle"
              >
                <span className="Sidebar-icon">
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <>
                    <span className="Sidebar-text">
                      {item.text}
                    </span>

                    <ChevronDown
                      size={15}
                      className={`Sidebar-chevron ${
                        isDropdownOpen
                          ? "rotated"
                          : ""
                      }`}
                    />
                  </>
                )}
              </button>

              {!isCollapsed && (
                <div className="Sidebar-submenu">
                  {item.subItems.map(
                    (subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `Sidebar-submenu-link ${
                            isActive ? "active" : ""
                          }`
                        }
                      >
                        <span className="Sidebar-submenu-icon">
                          {subItem.icon || (
                            <span className="Sidebar-submenu-dot" />
                          )}
                        </span>

                        <span>{subItem.text}</span>
                      </NavLink>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ==========================================
          BRAND FOOTER
      ========================================== */}
      <div className="Sidebar-brandFooter">
        <svg
          className="Sidebar-brandFooter-waves"
          viewBox="0 0 270 90"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="wave wave-1"
            d="M0,45 C50,30 90,60 140,45 C190,30 230,55 270,40 L270,90 L0,90 Z"
          />

          <path
            className="wave wave-2"
            d="M0,58 C60,44 100,70 150,55 C200,40 235,66 270,52 L270,90 L0,90 Z"
          />

          <path
            className="wave wave-3"
            d="M0,72 C55,60 105,80 150,68 C205,54 240,76 270,64 L270,90 L0,90 Z"
          />
        </svg>

        {!isCollapsed && (
          <span className="Sidebar-version">
            {version}
          </span>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;