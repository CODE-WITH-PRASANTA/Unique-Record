import React, { useState, useEffect } from 'react';
import API from '../../api/axiosInstance';
import './FinallUru.css';

const FinallUru = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploadingId, setUploadingId] = useState(null);

  // Fetch Paid URU applications from backend
  const fetchPaidRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get('/uru/paid');
      const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      setRecords(list);
    } catch (error) {
      console.error('Error fetching paid URU records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidRecords();
  }, []);

  // Filter records based on search query
  const filteredRecords = records.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      (item.name || item.applicantName || '').toLowerCase().includes(term) ||
      (item.appNo || item.applicationNumber || '').toLowerCase().includes(term) ||
      (item.transactionId || '').toLowerCase().includes(term) ||
      (item.email || '').toLowerCase().includes(term)
    );
  });

  // Handle file selection per row
  const handleFileChange = (id, e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRecords((prev) =>
        prev.map((rec) =>
          (rec.id || rec._id) === id ? { ...rec, file, fileName: file.name } : rec
        )
      );
    }
  };

  // Submit Certificate Upload Action
  const handleSubmitCertificate = async (item) => {
    const recordId = item._id || item.id || item.appNo || item.applicationNumber;
    if (!item.file) {
      alert('Please choose a certificate file to upload first.');
      return;
    }

    try {
      setUploadingId(item.id || item._id);
      const formData = new FormData();
      formData.append('certificate', item.file);

      const res = await API.post(`/uru/upload-certificate/${recordId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const updatedCertUrl = res.data?.certificateUrl || res.data?.data?.certificateUrl;

      setRecords((prev) =>
        prev.map((rec) =>
          (rec.id || rec._id) === (item.id || item._id)
            ? {
                ...rec,
                certificateUrl: updatedCertUrl || rec.certificateUrl,
                fileName: updatedCertUrl ? updatedCertUrl.split('/').pop() : item.file.name,
                file: null,
              }
            : rec
        )
      );

      alert(`Certificate uploaded successfully for application ${item.appNo || item.applicationNumber}!`);
    } catch (err) {
      console.error('Error uploading certificate:', err);
      alert(err.response?.data?.message || err.message || 'Failed to upload certificate.');
    } finally {
      setUploadingId(null);
    }
  };

  // Publish / Unpublish Action
  const handlePublish = async (id) => {
    const item = records.find((rec) => (rec.id || rec._id) === id);
    if (!item) return;

    const currentStatus = Boolean(item.published || item.isPublished);
    const targetStatus = !currentStatus;

    try {
      const res = await API.put(`/uru/publish-uru/${id}`, {
        isPublished: targetStatus,
        published: targetStatus,
      });

      const isNowPublished =
        typeof res.data?.isPublished === 'boolean'
          ? res.data.isPublished
          : typeof res.data?.published === 'boolean'
          ? res.data.published
          : targetStatus;

      setRecords((prev) =>
        prev.map((rec) =>
          (rec.id || rec._id) === id
            ? { ...rec, published: isNowPublished, isPublished: isNowPublished }
            : rec
        )
      );

      alert(
        isNowPublished
          ? `Application ${item.appNo || item.applicationNumber} is now Published!`
          : `Application ${item.appNo || item.applicationNumber} has been Unpublished.`
      );
    } catch (err) {
      console.error('Error toggling publish status:', err);
      alert(err.response?.data?.message || err.message || 'Failed to update publication status.');
    }
  };

  // Delete Action
  const handleDelete = async (id) => {
    const item = records.find((rec) => (rec.id || rec._id) === id);
    const appLabel = item ? (item.appNo || item.applicationNumber) : 'this record';

    if (window.confirm(`Are you sure you want to delete application ${appLabel}?`)) {
      try {
        await API.delete(`/uru/${id}`);
        setRecords((prev) => prev.filter((rec) => (rec.id || rec._id) !== id));
        alert(`Application ${appLabel} deleted successfully.`);
      } catch (err) {
        console.error('Error deleting record:', err);
        alert('Failed to delete application.');
      }
    }
  };

  // Excel Download Action
  const handleDownloadExcel = () => {
    if (records.length === 0) {
      alert('No data available to export.');
      return;
    }

    const headers = [
      'Sl No.',
      'Application No.',
      'Application Date',
      'Applicant Name',
      'Payment Status',
      'Transaction ID',
      'Certificate URL',
      'Published Status',
    ];
    const rows = filteredRecords.map((item, index) => [
      index + 1,
      item.appNo || item.applicationNumber,
      item.date || 'N/A',
      `"${item.name || item.applicantName || ''}"`,
      item.paymentStatus || 'Success',
      item.transactionId || 'N/A',
      item.certificateUrl || 'No Certificate',
      item.published || item.isPublished ? 'Published' : 'Draft',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Final_Paid_URU_Records_${new Date().toISOString().slice(0, 10)}.xls`);
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
            <h1 className="fin-uru-title">Final URU (Paid Applications)</h1>
            <div className="fin-uru-title-underline"></div>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
              Applications with successful payment status appear here for certificate uploads and live publication.
            </p>
          </div>
          <button className="fin-uru-btn-excel" onClick={handleDownloadExcel}>
            <svg
              width="18"
              height="18"
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
            <span>Download Excel Sheet</span>
          </button>
        </header>

        {/* Search Toolbar */}
        <div className="fin-uru-toolbar-section">
          <div className="fin-uru-search-wrapper">
            <input
              type="text"
              className="fin-uru-search-input"
              placeholder="Search by application number, applicant name, or transaction ID..."
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
                {loading ? (
                  <tr>
                    <td colSpan="7" className="fin-uru-empty-row" style={{ padding: '30px', textAlign: 'center' }}>
                      Loading paid URU records...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="fin-uru-empty-row">
                      No paid URU applications found. When an application payment is confirmed, it will appear here automatically.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item, index) => {
                    const recordId = item.id || item._id;
                    const isPublished = Boolean(item.published || item.isPublished);
                    const isUploading = uploadingId === recordId;

                    return (
                      <tr key={recordId || index} className="fin-uru-table-row">
                        <td className="fin-uru-col-sl">{index + 1}</td>
                        <td className="fin-uru-col-appno">
                          <strong>{item.appNo || item.applicationNumber}</strong>
                        </td>
                        <td>{item.date}</td>
                        <td className="fin-uru-col-name">{item.name || item.applicantName}</td>
                        <td>
                          <span className="fin-uru-status-badge success">
                            {item.paymentStatus || 'Success'}
                          </span>
                        </td>
                        <td className="fin-uru-col-upload">
                          <div className="fin-uru-file-picker">
                            <label className="fin-uru-file-btn">
                              Choose File
                              <input
                                type="file"
                                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                className="fin-uru-hidden-input"
                                onChange={(e) => handleFileChange(recordId, e)}
                              />
                            </label>
                            <span className="fin-uru-file-name" title={item.fileName || 'No file chosen'}>
                              {item.certificateUrl ? (
                                <a
                                  href={item.certificateUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ color: '#7c3aed', textDecoration: 'underline' }}
                                  title="Click to view existing certificate"
                                >
                                  {item.fileName || 'View Certificate'}
                                </a>
                              ) : (
                                item.fileName || 'No file chosen'
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="fin-uru-col-action">
                          <div className="fin-uru-action-group">
                            <button
                              className="fin-uru-btn-submit"
                              onClick={() => handleSubmitCertificate(item)}
                              disabled={isUploading}
                            >
                              {isUploading ? 'Uploading…' : 'Submit'}
                            </button>
                            <button
                              className="fin-uru-btn-delete"
                              onClick={() => handleDelete(recordId)}
                            >
                              Delete
                            </button>
                            <button
                              className={`fin-uru-btn-publish ${isPublished ? 'published' : ''}`}
                              onClick={() => handlePublish(recordId)}
                            >
                              {isPublished ? 'Published' : 'Publish'}
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

export default FinallUru;