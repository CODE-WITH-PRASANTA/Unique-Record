import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axiosInstance';
import './BlogCommentes.css';

const BlogCommentes = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch all comments from backend
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/blog-comments');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setComments(list);
    } catch (err) {
      console.error('Error fetching blog comments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  // Filter comments based on search input and status
  const filteredComments = comments.filter((item) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      !term ||
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.subject?.toLowerCase().includes(term) ||
      item.message?.toLowerCase().includes(term) ||
      item.address?.toLowerCase().includes(term) ||
      item.blogTitle?.toLowerCase().includes(term);

    const itemStatus = item.status || (item.isPublished ? 'Approved' : 'Draft');
    const matchStatus =
      statusFilter === 'All' ||
      itemStatus.toLowerCase() === statusFilter.toLowerCase();

    return matchSearch && matchStatus;
  });

  // Open View Modal
  const handleView = (comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  // Toggle Comment Status (Draft ↔ Approved)
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Approved' ? 'Draft' : 'Approved';
    try {
      const res = await API.patch(`/blog-comments/${id}/status`, {
        status: newStatus,
      });
      if (res.data?.success || res.status === 200) {
        setComments((prev) =>
          prev.map((c) =>
            (c._id || c.id) === id
              ? { ...c, status: newStatus, isPublished: newStatus === 'Approved' }
              : c
          )
        );
        if (selectedComment && (selectedComment._id || selectedComment.id) === id) {
          setSelectedComment((prev) => ({
            ...prev,
            status: newStatus,
            isPublished: newStatus === 'Approved',
          }));
        }
      }
    } catch (err) {
      console.error('Error updating blog comment status:', err);
      alert('Failed to update status. Please try again.');
    }
  };

  // Delete Comment
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog comment?')) {
      try {
        await API.delete(`/blog-comments/${id}`);
        setComments((prev) => prev.filter((item) => (item._id || item.id) !== id));
        if (isModalOpen && (selectedComment?._id || selectedComment?.id) === id) {
          setIsModalOpen(false);
        }
      } catch (err) {
        console.error('Error deleting comment:', err);
        alert('Failed to delete comment. Please try again.');
      }
    }
  };

  return (
    <div className="bc-container">
      <div className="bc-wrapper">
        {/* Header Section */}
        <header className="bc-header-section">
          <div className="bc-title-badge">
            <span className="bc-title-icon">📝</span>
            <div>
              <h1 className="bc-main-title">Blog Comments</h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Manage feedback submitted from public blog articles (Initial status: Draft)
              </p>
            </div>
          </div>
          <div
            className="bc-search-wrapper"
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
              className="bc-search-input"
              placeholder="Search comments by name, email, topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Table Section */}
        <section className="bc-table-section">
          <div className="bc-table-responsive">
            <table className="bc-data-table">
              <thead>
                <tr>
                  <th className="bc-col-sl">SL NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>SUBJECT</th>
                  <th>STATUS</th>
                  <th>ADDRESS</th>
                  <th>MESSAGE</th>
                  <th className="bc-text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="bc-empty-row">
                      Loading blog comments from database...
                    </td>
                  </tr>
                ) : filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="bc-empty-row">
                      No blog comments found.
                    </td>
                  </tr>
                ) : (
                  filteredComments.map((item, index) => {
                    const itemId = item._id || item.id;
                    const itemStatus =
                      item.status || (item.isPublished ? 'Approved' : 'Draft');
                    const isApproved = itemStatus === 'Approved';

                    return (
                      <tr key={itemId} className="bc-table-row">
                        <td className="bc-col-sl">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="bc-col-name">
                          <strong>{item.name}</strong>
                          {item.blogTitle && (
                            <span
                              style={{
                                display: 'block',
                                fontSize: '11px',
                                color: '#3b82f6',
                                fontWeight: 500,
                              }}
                            >
                              On: {item.blogTitle}
                            </span>
                          )}
                        </td>
                        <td>{item.email}</td>
                        <td>{item.phone || '—'}</td>
                        <td>
                          <strong>{item.subject}</strong>
                        </td>
                        <td>
                          <button
                            type="button"
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
                        <td>{item.address || '—'}</td>
                        <td className="bc-col-message" title={item.message}>
                          {item.message}
                        </td>
                        <td className="bc-col-action">
                          <div className="bc-action-group">
                            <button
                              type="button"
                              className="bc-btn-view"
                              onClick={() => handleView(item)}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="bc-btn-delete"
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
          <div
            className="bc-modal-overlay"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bc-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bc-modal-header">
                <h2>Blog Comment Details</h2>
                <button
                  type="button"
                  className="bc-modal-close"
                  onClick={() => setIsModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="bc-modal-body">
                <div className="bc-detail-group">
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
                          (selectedComment.status ||
                            (selectedComment.isPublished
                              ? 'Approved'
                              : 'Draft')) === 'Approved'
                            ? '#dcfce7'
                            : '#fef3c7',
                        color:
                          (selectedComment.status ||
                            (selectedComment.isPublished
                              ? 'Approved'
                              : 'Draft')) === 'Approved'
                            ? '#166534'
                            : '#92400e',
                      }}
                    >
                      {selectedComment.status ||
                        (selectedComment.isPublished ? 'Approved' : 'Draft')}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleStatus(
                          selectedComment._id || selectedComment.id,
                          selectedComment.status ||
                            (selectedComment.isPublished
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
                      {(selectedComment.status ||
                        (selectedComment.isPublished
                          ? 'Approved'
                          : 'Draft')) === 'Approved'
                        ? 'Set as Draft'
                        : 'Approve & Publish'}
                    </button>
                  </div>
                </div>

                {selectedComment.blogTitle && (
                  <div className="bc-detail-group">
                    <label>Target Blog:</label>
                    <p>
                      <strong>{selectedComment.blogTitle}</strong>
                    </p>
                  </div>
                )}

                <div className="bc-detail-group">
                  <label>Name:</label>
                  <p>{selectedComment.name}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Email:</label>
                  <p>{selectedComment.email}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Phone:</label>
                  <p>{selectedComment.phone || '—'}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Subject:</label>
                  <p>{selectedComment.subject}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Address:</label>
                  <p>{selectedComment.address || '—'}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Message:</label>
                  <p className="bc-message-box">{selectedComment.message}</p>
                </div>
              </div>
              <div className="bc-modal-footer">
                <button
                  type="button"
                  className="bc-modal-btn-close"
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

export default BlogCommentes;