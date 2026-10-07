import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axiosInstance';
import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaTrashAlt,
  FaEye,
  FaSyncAlt,
  FaCopy,
  FaCheck,
  FaIdCard,
  FaGlobe,
} from 'react-icons/fa';
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all Frontend Users from the 'users' table
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/all');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setUsers(list);
    } catch (err) {
      console.error('Error fetching users from users collection:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Copy to clipboard helper
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    const name = (user.fullName || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const phone = (user.phoneNumber || '').toLowerCase();
    const uniqueId = (user.uniqueId || '').toLowerCase();
    const status = (user.status || 'Active').toLowerCase();

    const matchesSearch =
      !term ||
      name.includes(term) ||
      email.includes(term) ||
      phone.includes(term) ||
      uniqueId.includes(term);

    const matchesStatus =
      statusFilter === 'All' || status === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => (u.status || 'Active') === 'Active').length;
  const gmailUsers = users.filter((u) => u.email?.toLowerCase().endsWith('@gmail.com')).length;
  const activeLogins = users.filter((u) => u.lastLogin).length;

  // Toggle user status (Active <-> Inactive)
  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      setActionLoading(true);
      const res = await API.patch(`/users/${userId}/status`, { status: newStatus });
      if (res.data?.success || res.status === 200) {
        setUsers((prev) =>
          prev.map((u) =>
            (u._id || u.id) === userId ? { ...u, status: newStatus } : u
          )
        );
        if (selectedUser && (selectedUser._id || selectedUser.id) === userId) {
          setSelectedUser((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      alert('Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete user from 'users' table
  const handleDelete = async (userId, userName) => {
    if (
      window.confirm(
        `Are you sure you want to delete user "${userName || 'this user'}" from the users table?`
      )
    ) {
      try {
        setActionLoading(true);
        await API.delete(`/users/${userId}`);
        setUsers((prev) => prev.filter((u) => (u._id || u.id) !== userId));
        if (isModalOpen && (selectedUser?._id || selectedUser?.id) === userId) {
          setIsModalOpen(false);
        }
      } catch (err) {
        alert('Failed to delete user.');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Open Details Modal
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Helper to format date
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="users-page-container">
      <div className="users-page-wrapper">
        {/* Header Title Section */}
        <header className="users-page-header">
          <div className="users-title-badge">
            <span className="users-title-icon">
              <FaUsers />
            </span>
            <div>
              <h1 className="users-main-title">Frontend Users Table (<code>users</code> collection)</h1>
              <p className="users-main-subtitle">
                Manage registered frontend website users, Gmail logins, Unique IDs (26OS...), and account status.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="users-btn-refresh"
            onClick={fetchUsers}
            disabled={loading}
          >
            <FaSyncAlt className={loading ? 'spin-icon' : ''} /> Refresh Table
          </button>
        </header>

        {/* Top Summary Metrics Cards */}
        <div className="users-metrics-grid">
          <div className="metric-card card-total">
            <div className="metric-icon-wrap icon-blue">
              <FaUsers />
            </div>
            <div className="metric-content">
              <span className="metric-label">Total Frontend Users</span>
              <strong className="metric-value">{totalUsers}</strong>
            </div>
          </div>

          <div className="metric-card card-gmail">
            <div className="metric-icon-wrap icon-red">
              <FaEnvelope />
            </div>
            <div className="metric-content">
              <span className="metric-label">Gmail Accounts</span>
              <strong className="metric-value">{gmailUsers}</strong>
            </div>
          </div>

          <div className="metric-card card-active">
            <div className="metric-icon-wrap icon-green">
              <FaUserCheck />
            </div>
            <div className="metric-content">
              <span className="metric-label">Active Users</span>
              <strong className="metric-value">{activeUsers}</strong>
            </div>
          </div>

          <div className="metric-card card-admins">
            <div className="metric-icon-wrap icon-purple">
              <FaGlobe />
            </div>
            <div className="metric-content">
              <span className="metric-label">Active Login Sessions</span>
              <strong className="metric-value">{activeLogins}</strong>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="users-filter-bar">
          <div className="users-search-box">
            <FaSearch className="users-search-icon" />
            <input
              type="text"
              placeholder="Search by Full Name, Gmail/Email, Unique ID (26OS...), or Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="users-search-input"
            />
          </div>

          <div className="users-role-filter">
            <label>Filter Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="users-select-role"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="users-table-container">
          <div className="users-table-responsive">
            <table className="users-data-table">
              <thead>
                <tr>
                  <th className="th-sno">S.NO.</th>
                  <th>USER / NAME</th>
                  <th>GMAIL / EMAIL</th>
                  <th>UNIQUE ID</th>
                  <th>PHONE NUMBER</th>
                  <th>STATUS</th>
                  <th>LAST LOGIN</th>
                  <th>REGISTERED DATE</th>
                  <th className="th-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="users-empty-row">
                      <FaSyncAlt className="spin-icon" /> Loading users table records...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="users-empty-row">
                      No frontend users found in the <code>users</code> table. Register on the frontend to populate!
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((item, index) => {
                    const itemId = item._id || item.id;
                    const userName = item.fullName || 'User';
                    const userEmail = item.email || '—';
                    const uniqueId = item.uniqueId || '—';
                    const phone = item.phoneNumber || '—';
                    const status = item.status || 'Active';
                    const isActive = status === 'Active';
                    const initials = userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase();

                    return (
                      <tr key={itemId} className="users-table-row">
                        <td className="td-sno">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="td-name">
                          <div className="user-avatar-cell">
                            <span className="user-avatar-circle role-user">
                              {initials || 'U'}
                            </span>
                            <div className="user-name-meta">
                              <strong>{userName}</strong>
                            </div>
                          </div>
                        </td>
                        <td className="td-email">
                          <div className="email-badge-cell">
                            <FaEnvelope className="email-icon" />
                            <span>{userEmail}</span>
                          </div>
                        </td>
                        <td className="td-unique-id">
                          <div className="unique-id-tag">
                            <code>{uniqueId}</code>
                            <button
                              type="button"
                              className="btn-copy-id"
                              onClick={() => handleCopy(uniqueId, itemId)}
                              title="Copy Unique ID"
                            >
                              {copiedId === itemId ? (
                                <FaCheck className="copied-icon" />
                              ) : (
                                <FaCopy />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="td-phone">
                          {phone !== '—' ? (
                            <span className="phone-badge">
                              <FaPhone className="phone-icon" /> {phone}
                            </span>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="td-role">
                          <button
                            type="button"
                            className={`role-pill ${isActive ? 'role-user' : 'role-admin'}`}
                            onClick={() => handleStatusToggle(itemId, status)}
                            title="Click to toggle Status (Active / Inactive)"
                          >
                            {isActive ? <FaUserCheck /> : <FaUserTimes />}
                            <span>{status.toUpperCase()}</span>
                          </button>
                        </td>
                        <td className="td-lastlogin">
                          {item.lastLogin ? (
                            <span className="timestamp-badge">
                              <FaClock /> {formatDate(item.lastLogin)}
                            </span>
                          ) : (
                            <span className="text-muted">Never Logged In</span>
                          )}
                        </td>
                        <td className="td-created">
                          <span className="created-date">
                            <FaCalendarAlt /> {formatDate(item.createdAt)}
                          </span>
                        </td>
                        <td className="td-actions">
                          <div className="user-actions-group">
                            <button
                              type="button"
                              className="btn-action-view"
                              onClick={() => handleViewDetails(item)}
                              title="View Full Profile"
                            >
                              <FaEye /> View
                            </button>
                            <button
                              type="button"
                              className="btn-action-delete"
                              onClick={() => handleDelete(itemId, userName)}
                              title="Delete from users table"
                              disabled={actionLoading}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed User Profile Modal */}
        {isModalOpen && selectedUser && (
          <div
            className="user-modal-overlay"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="user-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="user-modal-header">
                <div className="user-modal-title-wrap">
                  <FaIdCard className="modal-title-icon" />
                  <h2>Frontend User Details (<code>users</code> table)</h2>
                </div>
                <button
                  type="button"
                  className="user-modal-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>

              <div className="user-modal-body">
                {/* Profile Hero */}
                <div className="modal-hero-box">
                  <div className="modal-hero-avatar role-user">
                    {(selectedUser.fullName || 'User')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="modal-hero-info">
                    <h3>{selectedUser.fullName || 'User'}</h3>
                    <span className="modal-hero-email">{selectedUser.email}</span>
                    <span className={`role-pill ${selectedUser.status === 'Active' ? 'role-user' : 'role-admin'}`}>
                      {selectedUser.status === 'Active' ? <FaUserCheck /> : <FaUserTimes />}
                      {(selectedUser.status || 'Active').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="modal-details-grid">
                  <div className="modal-detail-item">
                    <label>Unique ID</label>
                    <div className="modal-id-row">
                      <code>{selectedUser.uniqueId || '—'}</code>
                      <button
                        type="button"
                        className="btn-copy-id"
                        onClick={() =>
                          handleCopy(selectedUser.uniqueId, 'modal-id')
                        }
                      >
                        {copiedId === 'modal-id' ? <FaCheck className="copied-icon" /> : <FaCopy />}
                      </button>
                    </div>
                  </div>

                  <div className="modal-detail-item">
                    <label>Mobile Number</label>
                    <p>{selectedUser.phoneNumber || 'Not provided'}</p>
                  </div>

                  <div className="modal-detail-item">
                    <label>Account Created Date</label>
                    <p>{formatDate(selectedUser.createdAt)}</p>
                  </div>

                  <div className="modal-detail-item">
                    <label>Last Login Activity</label>
                    <p>
                      {selectedUser.lastLogin
                        ? formatDate(selectedUser.lastLogin)
                        : 'No login recorded yet'}
                    </p>
                  </div>

                  <div className="modal-detail-item">
                    <label>MongoDB Document ID</label>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>
                      {selectedUser._id || selectedUser.id}
                    </p>
                  </div>

                  <div className="modal-detail-item">
                    <label>Active Token Sessions</label>
                    <p>{selectedUser.tokens ? selectedUser.tokens.length : 1} session(s)</p>
                  </div>
                </div>
              </div>

              <div className="user-modal-footer">
                <button
                  type="button"
                  className="modal-btn-role-toggle"
                  onClick={() =>
                    handleStatusToggle(
                      selectedUser._id || selectedUser.id,
                      selectedUser.status || 'Active'
                    )
                  }
                >
                  Set as {selectedUser.status === 'Active' ? 'Inactive' : 'Active'}
                </button>
                <button
                  type="button"
                  className="modal-btn-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
