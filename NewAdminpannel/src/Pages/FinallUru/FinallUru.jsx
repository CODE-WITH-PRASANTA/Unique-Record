import React, { useState } from 'react';
import './FinallUru.css';

const FinallUru = () => {
  // Initial Mock Data based on the reference UI
  const [records, setRecords] = useState([
    {
      id: 1,
      appNo: 'URU6310',
      date: '22 Sept 2026',
      name: 'Prasanta Kumar Khuntia',
      paymentStatus: 'Success',
      fileName: 'No file chosen',
      file: null,
      published: false,
    },
    {
      id: 2,
      appNo: 'URU3778',
      date: '22 Sept 2026',
      name: 'Prasanta Kumar Khuntia',
      paymentStatus: 'Success',
      fileName: 'No file chosen',
      file: null,
      published: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter records based on search query
  const filteredRecords = records.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.appNo.toLowerCase().includes(term)
    );
  });

  // Handle file upload per row
  const handleFileChange = (id, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRecords(
        records.map((rec) =>
          rec.id === id ? { ...rec, file, fileName: file.name } : rec
        )
      );
    }
  };

  // Submit Action
  const handleSubmit = (item) => {
    if (!item.file) {
      alert('Please choose a certificate file before submitting.');
      return;
    }
    alert(`Certificate "${item.fileName}" successfully submitted for application ${item.appNo}!`);
  };

  // Publish Action
  const handlePublish = (id) => {
    setRecords(
      records.map((rec) =>
        rec.id === id ? { ...rec, published: !rec.published } : rec
      )
    );
    const item = records.find((rec) => rec.id === id);
    alert(`Application ${item.appNo} publication status updated!`);
  };

  // Delete Action
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter((rec) => rec.id !== id));
    }
  };

  // Excel Download Action
  const handleDownloadExcel = () => {
    if (records.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = ['Sl No.', 'Application No.', 'Application Date', 'Applicant Name', 'Payment Status', 'Certificate File', 'Published Status'];
    const rows = filteredRecords.map((item, index) => [
      index + 1,
      item.appNo,
      item.date,
      `"${item.name}"`,
      item.paymentStatus,
      item.fileName,
      item.published ? 'Published' : 'Draft',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Final_URU_Records_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fin-uru-container">
      <div className="fin-uru-wrapper">
        
        {/* Header Section */}
        <header className="fin-uru-header-section">
          <div className="fin-uru-title-group">
            <h1 className="fin-uru-title">Final URU</h1>
            <div className="fin-uru-title-underline"></div>
          </div>
          <button className="fin-uru-btn-excel" onClick={handleDownloadExcel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download Excel Sheet</span>
          </button>
        </header>

        {/* Search Toolbar */}
        <div className="fin-uru-toolbar-section">
          <div className="fin-uru-search-wrapper">
            <input 
              type="text" 
              className="fin-uru-search-input" 
              placeholder="Search by application number or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <section className="fin-uru-table-section">
          <div className="fin-uru-table-responsive">
            <table className="fin-uru-data-table">
              <thead>
                <tr>
                  <th>Sl No.</th>
                  <th>Application No.</th>
                  <th>Application Date</th>
                  <th>Applicant Name</th>
                  <th>Payment Status</th>
                  <th>Upload Certificate</th>
                  <th className="fin-uru-text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="fin-uru-empty-row">No records found.</td>
                  </tr>
                ) : (
                  filteredRecords.map((item, index) => (
                    <tr key={item.id} className="fin-uru-table-row">
                      <td className="fin-uru-col-sl">{index + 1}</td>
                      <td className="fin-uru-col-appno"><strong>{item.appNo}</strong></td>
                      <td>{item.date}</td>
                      <td className="fin-uru-col-name">{item.name}</td>
                      <td>
                        <span className="fin-uru-status-badge success">{item.paymentStatus}</span>
                      </td>
                      <td className="fin-uru-col-upload">
                        <div className="fin-uru-file-picker">
                          <label className="fin-uru-file-btn">
                            Choose File
                            <input 
                              type="file" 
                              className="fin-uru-hidden-input" 
                              onChange={(e) => handleFileChange(item.id, e)}
                            />
                          </label>
                          <span className="fin-uru-file-name" title={item.fileName}>
                            {item.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="fin-uru-col-action">
                        <div className="fin-uru-action-group">
                          <button 
                            className="fin-uru-btn-submit" 
                            onClick={() => handleSubmit(item)}
                          >
                            Submit
                          </button>
                          <button 
                            className="fin-uru-btn-delete" 
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                          <button 
                            className={`fin-uru-btn-publish ${item.published ? 'published' : ''}`}
                            onClick={() => handlePublish(item.id)}
                          >
                            {item.published ? 'Published' : 'Publish'}
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

export default FinallUru;