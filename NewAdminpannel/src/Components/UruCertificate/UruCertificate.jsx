import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import logoImg from '../../assets/UNQUE.png';
import './UruCertificate.css';

/**
 * UruCertificate Component
 * Exact pixel-faithful reproduction of the official "Unique Records of Universe"
 * Digital Evidence of Extraordinary Achievement Certificate template.
 */
const UruCertificate = forwardRef(({ data = {}, scale = 1, id = "uru-printable-certificate" }, ref) => {
  const {
    appNo = 'URU5924',
    regNo = 'SCUU12VU1185',
    category = 'Education',
    recordType = 'Unique Record',
    applicantName = 'DR. MAKHAN LAL TANWAR',
    location = 'Narnaul, Haryana, India',
    qrUrl = 'https://ouruniverse.in/achiever/588e00f9e12487005ebd386e5',
    digitizationDate = '28 August 2025',
    existingBase = 'Milky Way Galaxy',
    taglineHindi = 'एक अनोखा प्रयास, एक कदम और (विश्वास से परे सफलता की ओर)',
  } = data;

  const isOne = scale === 1;

  return (
    <div
      className="uru-cert-scaler"
      style={{
        width: isOne ? '760px' : `${Math.round(760 * scale)}px`,
        height: isOne ? '1075px' : `${Math.round(1075 * scale)}px`,
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <div
        className="uru-cert-container"
        ref={ref}
        id={id}
        style={{
          width: '760px',
          height: '1075px',
          transform: isOne ? 'none' : `scale(${scale})`,
          transformOrigin: 'top left',
          position: isOne ? 'relative' : 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {/* Double border styling */}
        <div className="uru-cert-inner-frame">
          
          {/* Top Tagline Hindi */}
          <div className="uru-cert-top-bar">
            <span className="uru-cert-hindi-tagline">{taglineHindi}</span>
          </div>

          {/* Logo Section */}
          <div className="uru-cert-logo-section">
            <img src={logoImg} alt="Unique Records of Universe" className="uru-cert-logo" />
          </div>

          {/* Organization Title & Subtitle */}
          <div className="uru-cert-heading-block">
            <h1 className="uru-cert-main-title">Unique Records of Universe</h1>
            <p className="uru-cert-subtitle">Digitally Marking the Extraordinary Achievement.</p>
          </div>

          {/* App / Regd / Category / Type Metadata row */}
          <div className="uru-cert-meta-row">
            <div className="uru-cert-meta-left">
              <div className="uru-cert-meta-item">
                <span className="uru-cert-meta-label">App. No:</span>
                <span className="uru-cert-meta-val">{appNo}</span>
              </div>
              <div className="uru-cert-meta-item">
                <span className="uru-cert-meta-label">Regd. No:</span>
                <span className="uru-cert-meta-val">{regNo}</span>
              </div>
            </div>

            <div className="uru-cert-meta-right">
              <div className="uru-cert-meta-item right-align">
                <span className="uru-cert-meta-label">Category:</span>
                <span className="uru-cert-meta-val">{category}</span>
              </div>
              <div className="uru-cert-meta-item right-align">
                <span className="uru-cert-meta-label">Type:</span>
                <span className="uru-cert-meta-val">{recordType}</span>
              </div>
            </div>
          </div>

          {/* Digital Evidence Header */}
          <div className="uru-cert-digital-evidence">
            <h2>Digital Evidence of Extraordinary Achievement</h2>
          </div>

          {/* Congratulatory Section */}
          <div className="uru-cert-congrats-block">
            <h3 className="uru-cert-congrats-text">Congratulations!</h3>
            <h2 className="uru-cert-applicant-name">{applicantName}</h2>
            <p className="uru-cert-location">{location}</p>
          </div>

          {/* Center Dynamic QR Code */}
          <div className="uru-cert-qr-section">
            <div className="uru-cert-qr-card">
              <QRCodeCanvas
                value={qrUrl || 'https://uniquerecordsofuniverse.com'}
                size={230}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: logoImg,
                  x: undefined,
                  y: undefined,
                  height: 38,
                  width: 38,
                  excavate: true,
                }}
              />
            </div>
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="uru-cert-qr-link"
            >
              {qrUrl}
            </a>
          </div>

          {/* Footer Section */}
          <div className="uru-cert-footer-row">
            {/* Bottom Left Info */}
            <div className="uru-cert-footer-left">
              <p>
                <strong>Digitization Date:</strong> {digitizationDate}
              </p>
              <p>
                <strong>Existing Base:</strong> {existingBase}
              </p>
            </div>

            {/* Bottom Right Certification Badge */}
            <div className="uru-cert-footer-right">
              <div className="uru-cert-badge-row">
                <div className="uru-cert-check-circle">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="uru-cert-success-title">Successfully</div>
              </div>

              <div className="uru-cert-marked-text">You are Digitally Marked as a</div>
              <div className="uru-cert-holder-text">&lsquo;Unique Records of Universe&rsquo; Holder.</div>
              
              <div className="uru-cert-powered-by">
                Powered by: <span className="uru-cert-trust-link">DPKHRC Trust</span>
              </div>
              <div className="uru-cert-trust-address">
                Thekma, Azamgarh, Uttar Pradesh, India
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});

UruCertificate.displayName = 'UruCertificate';

export default UruCertificate;
