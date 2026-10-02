import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axiosInstance';
import './UserOpinion.css';

const UserOpinion = () => {
  const [opinions, setOpinions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOpinion, setSelectedOpinion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all user opinions / contact submissions from backend
  const fetchOpinions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/user-opinions');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setOpinions(list);
    } catch (err) {
      console.error('Error fetching user opinions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpinions();
  }, [fetchOpinions]);

  // Filter opinions based on search input and status
  const filteredOpinions = opinions.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.phone?.toLowerCase().includes(term) ||
      item.designation?.toLowerCase().includes(term) ||
      item.address?.toLowerCase().includes(term) ||
      item.message?.toLowerCase().includes(term);

    const itemStatus = item.status || (item.isPublished ? 'Approved' : 'Draft');
    const matchStatus =
      statusFilter === 'All' ||
      itemStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  // Toggle Status Action (Draft ↔ Approved)
  const handleToggleStatus = async (id, currentStatus) => {
    const isApproved = currentStatus === 'Approved';
    const newStatus = isApproved ? 'Draft' : 'Approved';
    try {
      const res = await API.patch(`/user-opinions/${id}/status`, {
        status: newStatus,
      });
      if (res.data?.success || res.status === 200) {
        setOpinions((prev) =>
          prev.map((item) =>
            (item._id || item.id) === id
              ? { ...item, status: newStatus, isPublished: newStatus === 'Approved' }
              : item
          )
        );
        if (selectedOpinion && (selectedOpinion._id || selectedOpinion.id) === id) {
          setSelectedOpinion((prev) => ({
            ...prev,
            status: newStatus,
            isPublished: newStatus === 'Approved',
          }));
        }
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // Open View Modal
  const handleView = (opinion) => {
    setSelectedOpinion(opinion);
    setIsModalOpen(true);
  };

  // Delete Opinion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user opinion / contact query?')) {
      try {
        await API.delete(`/user-opinions/${id}`);
        setOpinions((prev) => prev.filter((item) => (item._id || item.id) !== id));
        if (isModalOpen && (selectedOpinion?._id || selectedOpinion?.id) === id) {
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error('Error deleting opinion:', err);
        alert('Failed to delete opinion. Please try again.');
      }
    }
  };

  return (
    <div className="uo-container">
      <div className="uo-wrapper">
        {/* Header Section */}
        <header className="uo-header-section">
          <div className="uo-title-badge">
            <span className="uo-title-icon">💬</span>
            <div>
              <h1 className="uo-main-title">User Opinions & Contacts</h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Manage contact form queries and opinions submitted from public contact page (Initial status: Draft)
              </p>
            </div>
          </div>
          <div
            className="uo-search-wrapper"
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '9px 14px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: '#ffffff',
                fontWeight: 600,
                outline: 'none',
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Drafts Only</option>
              <option value="Approved">Approved Only</option>
            </select>
            <input
              type="text"
              className="uo-search-input"
              placeholder="Search by name, email, query..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Table Section */}
        <section className="uo-table-section">
          <div className="uo-table-responsive">
            <table className="uo-data-table">
              <thead>
                <tr>
                  <th className="uo-col-sno">S.NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>AGE</th>
                  <th>DESIGNATION</th>
                  <th>ADDRESS</th>
                  <th>MESSAGE</th>
                  <th>STATUS</th>
                  <th className="uo-text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="uo-empty-row">
                      Loading user opinions and contact messages...
                    </td>
                  </tr>
                ) : filteredOpinions.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="uo-empty-row">
                      No user opinions or contact queries found.
                    </td>
                  </tr>
                ) : (
                  filteredOpinions.map((item, index) => {
                    const itemId = item._id || item.id;
                    const itemStatus =
                      item.status || (item.isPublished ? 'Approved' : 'Draft');
                    const isApproved = itemStatus === 'Approved';

                    return (
                      <tr key={itemId} className="uo-table-row">
                        <td className="uo-col-sno">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="uo-col-name">
                          <strong>{item.name}</strong>
                        </td>
                        <td>{item.email}</td>
                        <td>{item.phone || '—'}</td>
                        <td>{item.age || '—'}</td>
                        <td>
                          {item.designation ? (
                            <span className="uo-designation-pill">
                              {item.designation}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>{item.address || '—'}</td>
                        <td className="uo-col-message" title={item.message}>
                          {item.message}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={`uo-status-badge ${
                              isApproved ? 'approved' : 'pending'
                            }`}
                            onClick={() => handleToggleStatus(itemId, itemStatus)}
                            title="Click to toggle Draft / Approved status"
                            style={{
                              padding: '4px 10px',
                              borderRadius: '20px',
                              border: 'none',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              background: isApproved ? '#dcfce7' : '#fef3c7',
                              color: isApproved ? '#166534' : '#92400e',
                              transition: 'all 0.2s',
                            }}
                          >
                            {itemStatus}
                          </button>
                        </td>
                        <td className="uo-col-action">
                          <div className="uo-action-group">
                            <button
                              type="button"
                              className="uo-btn-view"
                              onClick={() => handleView(item)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="uo-btn-delete"
                              onClick={() => handleDelete(itemId)}
                            >
                              Delete
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
        </section>

        {/* View Details Modal */}
        {isModalOpen && selectedOpinion && (
          <div
            className="uo-modal-overlay"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="uo-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="uo-modal-header">
                <h2>User Opinion / Contact Details</h2>
                <button
                  type="button"
                  className="uo-modal-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="uo-modal-body">
                <div className="uo-detail-group">
                  <label>Status:</label>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background:
                          (selectedOpinion.status ||
                            (selectedOpinion.isPublished
                              ? 'Approved'
                              : 'Draft')) === 'Approved'
                            ? '#dcfce7'
                            : '#fef3c7',
                        color:
                          (selectedOpinion.status ||
                            (selectedOpinion.isPublished
                              ? 'Approved'
                              : 'Draft')) === 'Approved'
                            ? '#166534'
                            : '#92400e',
                      }}
                    >
                      {selectedOpinion.status ||
                        (selectedOpinion.isPublished ? 'Approved' : 'Draft')}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(
                          selectedOpinion._id || selectedOpinion.id,
                          selectedOpinion.status ||
                            (selectedOpinion.isPublished
                              ? 'Approved'
                              : 'Draft')
                        )
                      }
                      style={{
                        padding: '4px 10px',
                        fontSize: '12px',
                        background: '#0f172a',
                        color: '#fff',
                        borderRadius: '6px',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {(selectedOpinion.status ||
                        (selectedOpinion.isPublished
                          ? 'Approved'
                          : 'Draft')) === 'Approved'
                        ? 'Set as Draft'
                        : 'Approve & Publish'}
                    </button>
                  </div>
                </div>

                <div className="uo-detail-group">
                  <label>Name:</label>
                  <p>{selectedOpinion.name}</p>
                </div>
                <div className="uo-detail-group">
                  <label>Email:</label>
                  <p>{selectedOpinion.email}</p>
                </div>
                <div className="uo-detail-group">
                  <label>Phone / Age:</label>
                  <p>
                    {selectedOpinion.phone || '—'}{' '}
                    {selectedOpinion.age ? `• ${selectedOpinion.age} yrs` : ''}
                  </p>
                </div>
                {selectedOpinion.designation && (
                  <div className="uo-detail-group">
                    <label>Designation:</label>
                    <p>{selectedOpinion.designation}</p>
                  </div>
                )}
                <div className="uo-detail-group">
                  <label>Address:</label>
                  <p>{selectedOpinion.address || '—'}</p>
                </div>
                <div className="uo-detail-group">
                  <label>Message / Query:</label>
                  <p className="uo-message-box">{selectedOpinion.message}</p>
                </div>
              </div>
              <div className="uo-modal-footer">
                <button
                  type="button"
                  className="uo-modal-btn-close"
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

export default UserOpinion;