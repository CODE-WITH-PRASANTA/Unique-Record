import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axiosInstance';
import './Subscribe.css';

const Subscribe = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all newsletter subscribers from backend
  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get('/newsletter');
      const list = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setSubscribers(list);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // Filter subscribers based on search input
  const filteredSubscribers = subscribers.filter((item) =>
    (item.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete Subscriber
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      try {
        await API.delete(`/newsletter/${id}`);
        setSubscribers((prev) => prev.filter((item) => (item._id || item.id) !== id));
      } catch (err) {
        console.error('Error deleting subscriber:', err);
        alert('Failed to delete subscriber. Please try again.');
      }
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? dateString
      : d.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
  };

  // Excel / CSV Download Action
  const handleDownloadExcel = () => {
    if (filteredSubscribers.length === 0) {
      alert('No subscribers available to export.');
      return;
    }

    const headers = ['Sl. No.', 'Subscribed Email', 'Created Date'];
    const rows = filteredSubscribers.map((item, index) => [
      index + 1,
      `"${item.email}"`,
      `"${formatDate(item.createdAt || item.date)}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Subscribers_List_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="sub-container">
      <div className="sub-wrapper">
        {/* Header Section */}
        <header className="sub-header-section">
          <div className="sub-title-badge">
            <span className="sub-title-icon">📬</span>
            <div>
              <h1 className="sub-main-title">Subscribed Newsletter</h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                Manage emails subscribed from the website footer newsletter
              </p>
            </div>
          </div>
          <div className="sub-header-actions">
            <div className="sub-search-wrapper">
              <input
                type="text"
                className="sub-search-input"
                placeholder="Search email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="sub-btn-excel"
              onClick={handleDownloadExcel}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download Excel</span>
            </button>
          </div>
        </header>

        {/* Table Section */}
        <section className="sub-table-section">
          <div className="sub-table-responsive">
            <table className="sub-data-table">
              <thead>
                <tr>
                  <th className="sub-col-sl">SL. NO.</th>
                  <th>SUBSCRIBED EMAIL</th>
                  <th>CREATED DATE</th>
                  <th className="sub-text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="sub-empty-row">
                      Loading subscribers...
                    </td>
                  </tr>
                ) : filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="sub-empty-row">
                      No subscribers found
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((item, index) => {
                    const itemId = item._id || item.id;
                    return (
                      <tr key={itemId} className="sub-table-row">
                        <td className="sub-col-sl">
                          {String(index + 1).padStart(2, '0')}
                        </td>
                        <td className="sub-col-email">
                          <strong>{item.email}</strong>
                        </td>
                        <td>{formatDate(item.createdAt || item.date)}</td>
                        <td className="sub-col-action">
                          <div className="sub-action-group">
                            <button
                              type="button"
                              className="sub-btn-delete"
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
      </div>
    </div>
  );
};

export default Subscribe;