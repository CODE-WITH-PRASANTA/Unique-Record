import React, { useState } from 'react';
import './DownCertificate.css';

const INITIAL_CERTIFICATES = [
  {
    id: 'URU3778',
    applicantName: 'Prasanta Kumar Khuntia',
    applicationDate: '22nd Sep 2026',
    category: 'Unique Record',
    status: 'verifying', // 'verifying' | 'ready' | 'downloaded'
    feePaid: true,
  },
  {
    id: 'URU6310',
    applicantName: 'Prasanta Kumar Khuntia',
    applicationDate: '22nd Sep 2026',
    category: 'Unique Activity',
    status: 'ready',
    feePaid: true,
  },
  {
    id: 'URU8942',
    applicantName: 'Ankita Nayak',
    applicationDate: '25th Sep 2026',
    category: 'Unique Record',
    status: 'ready',
    feePaid: true,
  },
  {
    id: 'URU9120',
    applicantName: 'Rahul Sharma',
    applicationDate: '28th Sep 2026',
    category: 'Unique Activity',
    status: 'verifying',
    feePaid: false,
  }
];

const DownCertificate = () => {
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Handle mock download action
  const handleDownload = (id) => {
    setCertificates((prev) =>
      prev.map((cert) => {
        if (cert.id === id) {
          alert(`Downloading digital certificate for Application No: ${id} 🚀`);
          return { ...cert, status: 'downloaded' };
        }
        return cert;
      })
    );
  };

  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch =
      cert.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.applicantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dc-dashboard-container">
      {/* Header Banner Section */}
      <header className="dc-header-section">
        <div className="dc-header-content">
          <span className="dc-badge-pill">✨ Official Archives</span>
          <h1 className="dc-main-title">Download Your Certificates</h1>
          <p className="dc-main-subtitle">
            Track your application status, complete verifications, and instantly download your secure digital recognition certificates.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="dc-controls-bar">
          <div className="dc-search-box">
            <svg className="dc-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search by Application No or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="dc-filter-tabs">
            <button
              className={`dc-filter-tab ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              All
            </button>
            <button
              className={`dc-filter-tab ${filterStatus === 'ready' ? 'active' : ''}`}
              onClick={() => setFilterStatus('ready')}
            >
              Ready
            </button>
            <button
              className={`dc-filter-tab ${filterStatus === 'verifying' ? 'active' : ''}`}
              onClick={() => setFilterStatus('verifying')}
            >
              Verifying
            </button>
          </div>
        </div>
      </header>

      {/* Certificates Grid Section */}
      <section className="dc-cards-grid-section">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((cert) => (
            <div className={`dc-cert-card ${cert.status}`} key={cert.id}>
              {/* Card Top Status Indicator */}
              <div className="dc-card-top-row">
                <span className={`dc-status-badge ${cert.status}`}>
                  {cert.status === 'verifying' && '⏳ Under Verification'}
                  {cert.status === 'ready' && '✅ Ready to Download'}
                  {cert.status === 'downloaded' && '📥 Downloaded'}
                </span>
                <span className="dc-category-tag">{cert.category}</span>
              </div>

              {/* Main Card Header */}
              <div className="dc-card-header">
                <h3 className="dc-card-title">Download Your Certificate</h3>
                <div className="dc-app-no-chip">
                  Application No: <strong>{cert.id}</strong>
                </div>
              </div>

              {/* Application Details Meta */}
              <div className="dc-card-meta">
                <div className="dc-meta-item highlight-border">
                  <span className="dc-meta-label">Application Date:</span>
                  <span className="dc-meta-value">{cert.applicationDate}</span>
                </div>
                <div className="dc-meta-item">
                  <span className="dc-meta-label">Applicant Name:</span>
                  <span className="dc-meta-value name">{cert.applicantName}</span>
                </div>
              </div>

              {/* Descriptive Notice */}
              <p className="dc-card-desc">
                {cert.status === 'verifying'
                  ? 'After verification, acceptance, and successful receipt of the prescribed fee, the button to download your digital certificate will be enabled. Please wait till then.'
                  : 'Your verification is successfully completed and approved. You can now download your verified digital certificate instantly.'}
              </p>

              {/* Animated Download Icon Graphic */}
              <div className={`dc-icon-circle-wrap ${cert.status}`}>
                <div className="dc-pulse-ring"></div>
                <div className="dc-download-icon-box">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </div>
              </div>

              {/* Action Button */}
              <div className="dc-card-action">
                {cert.status === 'verifying' ? (
                  <button type="button" className="dc-btn dc-btn-verifying" disabled>
                    <span className="dc-spinner"></span> Verifying...
                  </button>
                ) : cert.status === 'ready' ? (
                  <button type="button" className="dc-btn dc-btn-download" onClick={() => handleDownload(cert.id)}>
                    Download Certificate 📥
                  </button>
                ) : (
                  <button type="button" className="dc-btn dc-btn-downloaded" onClick={() => handleDownload(cert.id)}>
                    Download Again 🔄
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="dc-empty-state">
            <div className="dc-empty-icon">📂</div>
            <h3>No certificates found</h3>
            <p>Try adjusting your search query or filter criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default DownCertificate;