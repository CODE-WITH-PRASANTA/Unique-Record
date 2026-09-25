import React, { useState } from 'react';
import './Subscribe.css';

const Subscribe = () => {
  // Dummy data populated for subscribed newsletters matching reference columns
  const [subscribers, setSubscribers] = useState([
    {
      id: 1,
      email: 'pk@gmail.com',
      date: '22 Sept 2026',
    },
    {
      id: 2,
      email: 'ananya@gmail.com',
      date: '23 Sept 2026',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter subscribers based on search input
  const filteredSubscribers = subscribers.filter((item) =>
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete Subscriber
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this subscriber?')) {
      setSubscribers(subscribers.filter((item) => item.id !== id));
    }
  };

  // Excel Download Action
  const handleDownloadExcel = () => {
    if (subscribers.length === 0) {
      alert('No subscribers available to export.');
      return;
    }

    const headers = ['Sl. No.', 'Subscribed Email', 'Created Date'];
    const rows = filteredSubscribers.map((item, index) => [
      index + 1,
      item.email,
      item.date,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Subscribers_List_${new Date().toISOString().slice(0, 10)}.xls`);
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
            <h1 className="sub-main-title">Subscribed Newsletter</h1>
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
            <button className="sub-btn-excel" onClick={handleDownloadExcel}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
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
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="sub-empty-row">No subscribers found</td>
                  </tr>
                ) : (
                  filteredSubscribers.map((item, index) => (
                    <tr key={item.id} className="sub-table-row">
                      <td className="sub-col-sl">0{index + 1}</td>
                      <td className="sub-col-email"><strong>{item.email}</strong></td>
                      <td>{item.date}</td>
                      <td className="sub-col-action">
                        <div className="sub-action-group">
                          <button 
                            className="sub-btn-delete" 
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
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