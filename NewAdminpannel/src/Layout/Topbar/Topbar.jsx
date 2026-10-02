import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, ChevronDown, Bell, Search, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Topbar.css';

const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format path breadcrumb dynamically
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentPath = pathSegments.length > 0 
    ? pathSegments[pathSegments.length - 1].replace(/-/g, ' ') 
    : 'Dashboard';
  const parentPath = pathSegments.length > 1 
    ? pathSegments[0].toUpperCase() 
    : 'ADMIN';

  const adminName = user?.name || user?.userId || 'Administrator';
  const adminEmail = user?.email || 'admin@uniquerecord.com';

  return (
    <header className="Topbar">
      <div className="Topbar-left">
        <button 
          className="Topbar-toggle-btn" 
          onClick={toggleSidebar} 
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="Topbar-path">
          <span className="Topbar-path-parent">{parentPath}</span>
          <span className="Topbar-path-separator">/</span>
          <span className="Topbar-path-current">{currentPath}</span>
        </div>
      </div>

      <div className="Topbar-right">
        {/* Search Bar */}
        <div className="Topbar-search-box">
          <Search size={16} className="Topbar-search-icon" />
          <input 
            type="text" 
            placeholder="Search resources..." 
            className="Topbar-search-input" 
          />
          <kbd className="Topbar-search-shortcut">⌘K</kbd>
        </div>

        {/* Notifications */}
        <div className="Topbar-action-wrapper" ref={dropdownRef}>
          <button 
            className={`Topbar-action-btn ${notificationsOpen ? 'active' : ''}`}
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setDropdownOpen(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="Topbar-badge">1</span>
          </button>

          {notificationsOpen && (
            <div className="Topbar-dropdown Topbar-notifications-dropdown">
              <div className="Topbar-dropdown-header">
                <span className="Topbar-dropdown-title">Notifications</span>
                <span className="Topbar-dropdown-badge">System</span>
              </div>
              <div className="Topbar-notification-list">
                <div className="Topbar-notification-item unread">
                  <div className="Topbar-notification-dot" />
                  <div>
                    <p className="Topbar-notification-text">Welcome to URU Admin Panel.</p>
                    <span className="Topbar-notification-time">Active Session</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Profile Menu */}
          <div 
            className={`Topbar-user ${dropdownOpen ? 'active' : ''}`} 
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotificationsOpen(false);
            }}
          >
            <div className="Topbar-avatar-wrapper">
              <div className="Topbar-avatar" style={{
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                borderRadius: '50%',
              }}>
                {(adminName[0] || 'A').toUpperCase()}
              </div>
              <span className="Topbar-status-indicator" />
            </div>

            <div className="Topbar-user-info">
              <span className="Topbar-username">{adminName}</span>
              <span className="Topbar-role">Super Admin</span>
            </div>

            <ChevronDown size={15} className={`Topbar-chevron ${dropdownOpen ? 'open' : ''}`} />

            {dropdownOpen && (
              <div className="Topbar-dropdown Topbar-user-dropdown">
                <div className="Topbar-user-card">
                  <p className="Topbar-card-name">{adminName}</p>
                  <p className="Topbar-card-email">{adminEmail}</p>
                </div>
                <div className="Topbar-dropdown-divider" />
                <button
                  type="button"
                  className="Topbar-dropdown-item logout"
                  onClick={logout}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: '#dc2626',
                    fontWeight: 600,
                  }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;