import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axiosInstance';
import './ArchivementComment.css';

const ArchivementComment = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  // Fetch all comments from backend
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/comments/achievements');
      const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setComments(list);
    } catch (err) {
      console.error('Error fetching achievement comments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Filter comments based on search and status
  const filteredComments = comments.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.subject?.toLowerCase().includes(term) ||
      item.message?.toLowerCase().includes(term) ||
      item.address?.toLowerCase().includes(term);

    const matchStatus =
      statusFilter === 'All' ||
      (item.status && item.status.toLowerCase() === statusFilter.toLowerCase());

    return matchSearch && matchStatus;
  });

  // Open View Modal
  const handleView = (comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  // Toggle/Update Comment Status (Draft ↔ Approved)
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Draft' : 'Approved';
    try {
      const res = await API.patch(`/comments/${id}/status`, { status: newStatus });
      if (res.data?.success || res.status === 200) {
        setComments((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
        if (selectedComment && selectedComment._id === id) {
          setSelectedComment((prev) => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update comment status.');
    }
  };

  // Delete Comment
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this achievement comment?')) {
      try {
        await API.delete(`/comments/${id}`);
        setComments((prev) => prev.filter((item) => (item._id || item.id) !== id));
        if (isModalOpen && selectedComment?._id === id) {
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment.');
      }
    }
  };

  return (
    <div className="ac-container">
      <div className="ac-wrapper">
        {/* Header Section */}
        <header className="ac-header-section">
          <div className="ac-title-badge">
            <span className="ac-title-icon">🏆</span>
            <div>
              <h1 className="ac-main-title">Achievement Comments</h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Manage feedback submitted from public achievement detail pages (Initial status: Draft)
              </p>
            </div>
          </div>
          <div className="ac-search-wrapper" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Draft">Drafts Only</option>
              <option value="Approved">Approved Only</option>
            </select>
            <input
              type="text"
              className="ac-search-input"
              placeholder="Search comments by name, subject, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Table Section */}
        <section className="ac-table-section">
          <div className="ac-table-responsive">
            <table className="ac-data-table">
              <thead>
                <tr>
                  <th className="ac-col-sl">SL NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>SUBJECT</th>
                  <th>STATUS</th>
                  <th>ADDRESS</th>
                  <th>MESSAGE</th>
                  <th className="ac-text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="ac-empty-row">
                      Loading achievement comments from database...
                    </td>
                  </tr>
                ) : filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="ac-empty-row">
                      No achievement comments found.
                    </td>
                  </tr>
                ) : (
                  filteredComments.map((item, index) => {
                    const itemId = item._id || item.id;
                    const isApproved = item.status === 'Approved';
                    return (
                      <tr key={itemId} className="ac-table-row">
                        <td className="ac-col-sl">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="ac-col-name">
                          <strong>{item.name}</strong>
                          {item.achievementTitle && (
                            <span
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                color: '#6366f1',
                                fontWeight: 500,
                              }}
                            >
                              On: {item.achievementTitle}
                            </span>
                          )}
                        </td>
                        <td>{item.email}</td>
                        <td>{item.phone || '—'}</td>
                        <td className="ac-col-subject">
                          <strong>{item.subject}</strong>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(itemId, item.status)}
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
                            {item.status || 'Draft'}
                          </button>
                        </td>
                        <td>{item.address || '—'}</td>
                        <td className="ac-col-message" title={item.message}>
                          {item.message}
                        </td>
                        <td className="ac-col-action">
                          <div className="ac-action-group">
                            <button
                              type="button"
                              className="ac-btn-view"
                              onClick={() => handleView(item)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="ac-btn-delete"
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
        {isModalOpen && selectedComment && (
          <div className="ac-modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="ac-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="ac-modal-header">
                <h2>Achievement Comment Details</h2>
                <button
                  type="button"
                  className="ac-modal-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="ac-modal-body">
                <div className="ac-detail-group">
                  <label>Status:</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700,
                        background:
                          selectedComment.status === 'Approved'
                            ? '#dcfce7'
                            : '#fef3c7',
                        color:
                          selectedComment.status === 'Approved'
                            ? '#166534'
                            : '#92400e',
                      }}
                    >
                      {selectedComment.status || 'Draft'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(
                          selectedComment._id || selectedComment.id,
                          selectedComment.status
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
                      {selectedComment.status === 'Approved'
                        ? 'Set as Draft'
                        : 'Approve & Publish'}
                    </button>
                  </div>
                </div>
                {selectedComment.achievementTitle && (
                  <div className="ac-detail-group">
                    <label>Target Achievement:</label>
                    <p><strong>{selectedComment.achievementTitle}</strong></p>
                  </div>
                )}
                <div className="ac-detail-group">
                  <label>Name:</label>
                  <p>{selectedComment.name}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Email:</label>
                  <p>{selectedComment.email}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Phone:</label>
                  <p>{selectedComment.phone || '—'}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Subject:</label>
                  <p><strong>{selectedComment.subject}</strong></p>
                </div>
                <div className="ac-detail-group">
                  <label>Address:</label>
                  <p>{selectedComment.address || '—'}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Message:</label>
                  <p className="ac-message-box">{selectedComment.message}</p>
                </div>
              </div>
              <div className="ac-modal-footer">
                <button
                  type="button"
                  className="ac-modal-btn-close"
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

export default ArchivementComment;