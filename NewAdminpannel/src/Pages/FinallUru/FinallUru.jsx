import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  CheckCircle,
  ExternalLink,
  Trash2,
  Globe,
  FileSpreadsheet,
  Search,
  Eye
} from 'lucide-react';
import API from '../../api/axiosInstance';
import UruCertificateModal from '../../Components/UruCertificateModal/UruCertificateModal';
import './FinallUru.css';

const FinallUru = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Dynamic Certificate Modal State
  const [certModalOpen, setCertModalOpen] = useState(false);
  const [selectedRecordForCert, setSelectedRecordForCert] = useState(null);

  // Fetch Paid URU applications from backend with automatic fallback
  const fetchPaidRecords = async () => {
    try {
      setLoading(true);
      let list = [];
      try {
        const res = await API.get('/uru/paid');
        list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      } catch (err1) {
        console.warn('Fallback to /uru/final:', err1);
        const res = await API.get('/uru/final');
        list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
      }
      setRecords(list);
    } catch (error) {
      console.error('Error fetching paid URU records:', error);
      setRecords([]);
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

  // Open Certificate Designer Modal
  const handleOpenCertModal = (record) => {
    setSelectedRecordForCert(record);
    setCertModalOpen(true);
  };

  // Callback when certificate is uploaded/generated from the modal
  const handleCertificateUploaded = (recordId, certUrl) => {
    setRecords((prev) =>
      prev.map((rec) =>
        (rec.id || rec._id) === recordId
          ? {
              ...rec,
              certificateUrl: certUrl,
              fileName: typeof certUrl === 'string' ? certUrl.split('/').pop() : 'Certificate.png',
            }
          : rec
      )
    );
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
            <p className="fin-uru-subtitle">
              Confirmed applications with verified payment. Generate and publish dynamic certificates with official QR verification.
            </p>
          </div>
          <button className="fin-uru-btn-excel" onClick={handleDownloadExcel}>
            <FileSpreadsheet size={18} />
            <span>Download Excel Sheet</span>
          </button>
        </header>

        {/* Search Toolbar */}
        <div className="fin-uru-toolbar-section">
          <div className="fin-uru-search-wrapper">
            <Search size={18} color="#94a3b8" />
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
                  <th>Official Certificate</th>
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
                    const hasCertificate = Boolean(item.certificateUrl && item.certificateUrl.trim().length > 0);

                    return (
                      <tr key={recordId || index} className="fin-uru-table-row">
                        <td className="fin-uru-col-sl">{index + 1}</td>
                        <td className="fin-uru-col-appno">
                          <strong>{item.appNo || item.applicationNumber}</strong>
                        </td>
                        <td>{item.date || 'Recent'}</td>
                        <td className="fin-uru-col-name">{item.name || item.applicantName}</td>
                        <td>
                          <span className="fin-uru-status-badge success">
                            {item.paymentStatus || 'Success'}
                          </span>
                        </td>

                        {/* Official Dynamic Certificate Column */}
                        <td className="fin-uru-col-cert-manager">
                          <div className="fin-uru-cert-action-stack">
                            {hasCertificate ? (
                              <div className="fin-uru-cert-active-card">
                                <span className="fin-uru-cert-ready-pill">
                                  <CheckCircle size={13} /> Certificate Ready
                                </span>
                                <div className="fin-uru-cert-links-row">
                                  <button
                                    type="button"
                                    className="fin-uru-btn-edit-cert"
                                    onClick={() => handleOpenCertModal(item)}
                                    title="Open certificate designer to preview, customize, or re-download"
                                  >
                                    <Eye size={13} /> Preview / Edit
                                  </button>
                                  <a
                                    href={item.certificateUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="fin-uru-btn-view-file"
                                    title="View raw uploaded certificate file"
                                  >
                                    <ExternalLink size={13} /> View File
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="fin-uru-btn-generate"
                                onClick={() => handleOpenCertModal(item)}
                              >
                                <Sparkles size={15} /> Generate Dynamic Certificate
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Actions (Delete, Publish) */}
                        <td className="fin-uru-col-action">
                          <div className="fin-uru-action-group">
                            <button
                              className={`fin-uru-btn-publish ${isPublished ? 'published' : ''}`}
                              onClick={() => handlePublish(recordId)}
                              title={isPublished ? 'Click to unpublish' : 'Click to publish certificate live'}
                            >
                              <Globe size={13} />
                              {isPublished ? 'Published' : 'Publish'}
                            </button>
                            <button
                              className="fin-uru-btn-delete"
                              onClick={() => handleDelete(recordId)}
                              title="Delete this application"
                            >
                              <Trash2 size={13} />
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

      {/* Dynamic Certificate Designer / Preview Modal */}
      <UruCertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        record={selectedRecordForCert}
        onCertificateUploaded={handleCertificateUploaded}
      />
    </div>
  );
};

export default FinallUru;