import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  Download,
  Printer,
  CheckCircle2,
  X,
  FileCheck,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import companyLogo from '../../assets/UNQUE.png';
import {
  fetchLogoBase64,
  generateAndDownloadReceiptPdf,
  generateVectorReceiptPdf,
  printReceiptElement
} from './receiptUtils';
import './EventPaymentReceipt.css';

/**
 * EventPaymentReceipt Component
 * 
 * Generates and displays an authentic, attractive official event payment receipt.
 * Pre-fetches the company logo as Base64 to ensure crisp rendering.
 * Uses jsPDF pure vector PDF generation for 100% crisp typography and zero kerning collision.
 */
const EventPaymentReceipt = ({
  receiptData,
  isOpen = true,
  onClose,
  autoDownload = false,
  onDownloadComplete
}) => {
  const [logoBase64, setLogoBase64] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const receiptPrintAreaRef = useRef(null);

  const receiptId =
    receiptData?.receiptNo ||
    (receiptData?.applicationNumber ? `REC-${receiptData.applicationNumber}` : `REC-EVT${Date.now().toString().slice(-6)}`);
  
  const appNumber = receiptData?.applicationNumber || 'EVT-RECORD';
  const fileName = `UniqueRecord_Receipt_${appNumber}.pdf`;

  // Online Verification URL for QR Code
  const verificationUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/event/registration-status?appId=${encodeURIComponent(appNumber)}`
    : `https://ouruniverse.in/event/registration-status?appId=${encodeURIComponent(appNumber)}`;

  // 1. Fetch & Preload Logo as Base64 for 100% reliable canvas capture
  useEffect(() => {
    let isMounted = true;
    const preload = async () => {
      try {
        const base64 = await fetchLogoBase64(companyLogo);
        if (isMounted) {
          setLogoBase64(base64 || companyLogo);
        }
      } catch (err) {
        console.warn('Failed to fetch logo as base64, using raw source:', err);
        if (isMounted) {
          setLogoBase64(companyLogo);
        }
      }
    };

    preload();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Auto-Download Vector PDF once logo is fetched and DOM is painted
  useEffect(() => {
    if (autoDownload && logoBase64 && !hasAutoDownloaded && isOpen) {
      const runAutoDownload = async () => {
        setIsDownloading(true);
        await new Promise((r) => setTimeout(r, 350));
        try {
          const qrCanvas = document.getElementById('ur-receipt-qr-canvas');
          const qrDataUrl = qrCanvas ? qrCanvas.toDataURL('image/png') : null;
          generateVectorReceiptPdf(receiptData, logoBase64, qrDataUrl, fileName);
        } catch (err) {
          console.warn('Vector auto-download error, trying fallback:', err);
          await generateAndDownloadReceiptPdf('event-payment-receipt-print-area', fileName, receiptData, logoBase64);
        } finally {
          setIsDownloading(false);
          setHasAutoDownloaded(true);
          if (onDownloadComplete) {
            onDownloadComplete(true);
          }
        }
      };

      runAutoDownload();
    }
  }, [autoDownload, logoBase64, hasAutoDownloaded, isOpen, fileName, onDownloadComplete, receiptData]);

  // Handle manual download using jsPDF pure vector PDF
  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const qrCanvas = document.getElementById('ur-receipt-qr-canvas');
      const qrDataUrl = qrCanvas ? qrCanvas.toDataURL('image/png') : null;
      generateVectorReceiptPdf(receiptData, logoBase64, qrDataUrl, fileName);
    } catch (err) {
      console.warn('Vector PDF generation error, trying fallback:', err);
      await generateAndDownloadReceiptPdf('event-payment-receipt-print-area', fileName, receiptData, logoBase64);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle print
  const handlePrint = () => {
    printReceiptElement('event-payment-receipt-print-area');
  };

  if (!isOpen || !receiptData) {
    return null;
  }

  const formattedDate = receiptData.date || new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const formattedTime = receiptData.time || new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return (
    <div className="ur-receipt-modal-backdrop" onClick={onClose}>
      <div className="ur-receipt-modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Modal Top Header Bar */}
        <div className="ur-receipt-modal-header">
          <div className="ur-receipt-modal-title">
            <div className="ur-receipt-modal-title-icon">
              <FileCheck size={20} />
            </div>
            <div className="ur-receipt-modal-title-text">
              <h3>Official Event Payment Receipt</h3>
              <p>Unique Records of Universe · Divya Prerak Kahaniyan Trust</p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              className="ur-receipt-close-btn"
              onClick={onClose}
              title="Close Receipt Window"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Modal Scrollable Canvas Preview */}
        <div className="ur-receipt-modal-scroll">
          {/* Printable Official Receipt Paper */}
          <div
            className="ur-receipt-paper"
            id="event-payment-receipt-print-area"
            ref={receiptPrintAreaRef}
          >
            {/* Inner Gold Framing Border */}
            <div className="ur-receipt-inner-frame" aria-hidden="true"></div>

            {/* 1. Header with Logo & Org Details */}
            <div className="ur-receipt-header">
              <div className="ur-receipt-brand">
                <div className="ur-receipt-logo-wrap">
                  <img
                    src={logoBase64 || companyLogo}
                    alt="Unique Records of Universe Logo"
                    className="ur-receipt-logo-img"
                  />
                </div>
                <div className="ur-receipt-org-info">
                  <h1 className="ur-receipt-org-title">UNIQUE RECORDS OF UNIVERSE</h1>
                  <p className="ur-receipt-org-subtitle">
                    Unit of Divya Prerak Kahaniyan Humanity Research Centre Trust
                  </p>
                  <p className="ur-receipt-org-reg">
                    National &amp; International World Records Body · Reg. 80G Humanitarian Organization<br />
                    Thekma, Dist. Azamgarh, Uttar Pradesh - 276303 · Helpline: +91 9472351693
                  </p>
                </div>
              </div>

              <div className="ur-receipt-header-right">
                <div className="ur-receipt-status-badge">
                  <CheckCircle2 size={13} />
                  <span>{receiptData.paymentStatus === 'Refunded' ? 'REFUNDED' : 'PAID & CONFIRMED'}</span>
                </div>
                <div className="ur-receipt-qr-wrap" title="Scan to verify application record">
                  <QRCodeCanvas
                    id="ur-receipt-qr-canvas"
                    value={verificationUrl}
                    size={64}
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>
            </div>

            {/* 2. Banner Ribbon */}
            <div className="ur-receipt-banner">
              <span className="ur-receipt-banner-title">
                Official Event Registration &amp; Payment Receipt
              </span>
              <span className="ur-receipt-banner-meta">
                Verified Date: {formattedDate} · {formattedTime}
              </span>
            </div>

            {/* 3. Transaction Meta Cards (4 Distinct Columns) */}
            <div className="ur-receipt-meta-grid">
              <div className="ur-receipt-meta-card">
                <span className="ur-receipt-meta-card-label">Receipt Number</span>
                <span className="ur-receipt-meta-card-value ur-receipt-meta-card-value--blue">
                  {receiptId}
                </span>
              </div>
              <div className="ur-receipt-meta-card">
                <span className="ur-receipt-meta-card-label">Application ID</span>
                <span className="ur-receipt-meta-card-value ur-receipt-meta-card-value--blue">
                  {appNumber}
                </span>
              </div>
              <div className="ur-receipt-meta-card">
                <span className="ur-receipt-meta-card-label">Payment ID</span>
                <span className="ur-receipt-meta-card-value ur-receipt-meta-card-value--mono">
                  {receiptData.razorpayPaymentId || 'pay_ONLINE'}
                </span>
              </div>
              <div className="ur-receipt-meta-card">
                <span className="ur-receipt-meta-card-label">Order ID</span>
                <span className="ur-receipt-meta-card-value ur-receipt-meta-card-value--mono">
                  {receiptData.razorpayOrderId || 'order_PROCESSED'}
                </span>
              </div>
            </div>

            {/* 4. Event Information Highlight Box */}
            <div className="ur-receipt-event-box">
              <div className="ur-receipt-event-title-group">
                <span className="ur-receipt-event-label">Registered Target Event</span>
                <span className="ur-receipt-event-name">
                  {receiptData.eventName || 'Official Record Event'}
                </span>
              </div>
              <span className="ur-receipt-event-tag">
                Participant Pass Slot · Confirmed
              </span>
            </div>

            {/* 5. Applicant Particulars (Clean 2-Column Grid) */}
            <div className="ur-receipt-section">
              <div className="ur-receipt-section-header">
                <span>Applicant Information</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>✓ Verified Particulars</span>
              </div>
              <div className="ur-receipt-info-grid">
                <div className="ur-receipt-info-item">
                  <span className="ur-receipt-info-label">Applicant Name</span>
                  <span className="ur-receipt-info-val">
                    <strong>{receiptData.applicantName || 'Applicant'}</strong>
                  </span>
                </div>
                <div className="ur-receipt-info-item">
                  <span className="ur-receipt-info-label">Gender &amp; Date of Birth</span>
                  <span className="ur-receipt-info-val">
                    {receiptData.sex || receiptData.gender || 'N/A'} · DOB: {receiptData.dateOfBirth || receiptData.dob || 'N/A'}
                  </span>
                </div>
                <div className="ur-receipt-info-item">
                  <span className="ur-receipt-info-label">WhatsApp Contact</span>
                  <span className="ur-receipt-info-val">
                    {receiptData.whatsappNumber || receiptData.phone || 'N/A'}
                  </span>
                </div>
                <div className="ur-receipt-info-item">
                  <span className="ur-receipt-info-label">Registered Email</span>
                  <span className="ur-receipt-info-val">
                    {receiptData.email || 'N/A'}
                  </span>
                </div>
                <div className="ur-receipt-info-item ur-receipt-info-item--full">
                  <span className="ur-receipt-info-label">Address &amp; Location</span>
                  <span className="ur-receipt-info-val">
                    {[
                      receiptData.localAddress || receiptData.address,
                      receiptData.district,
                      receiptData.state,
                      receiptData.pinCode ? `PIN: ${receiptData.pinCode}` : ''
                    ]
                      .filter(Boolean)
                      .join(', ') || 'N/A'}
                  </span>
                </div>
                {receiptData.educationalQualification && (
                  <div className="ur-receipt-info-item ur-receipt-info-item--full">
                    <span className="ur-receipt-info-label">Qualification &amp; Specialization</span>
                    <span className="ur-receipt-info-val">
                      {receiptData.educationalQualification}
                      {receiptData.expertise ? ` (Specialization: ${receiptData.expertise})` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 6. Invoice & Financial Statement Table */}
            <div className="ur-receipt-section">
              <div className="ur-receipt-section-header">
                <span>Payment &amp; Fee Breakdown</span>
                <span>Official Statement</span>
              </div>
              <table className="ur-receipt-table">
                <thead>
                  <tr>
                    <th style={{ width: '8%' }}>S.No</th>
                    <th style={{ width: '48%' }}>Item Description</th>
                    <th style={{ width: '12%', textAlign: 'center' }}>Qty</th>
                    <th style={{ width: '18%', textAlign: 'center' }}>Status</th>
                    <th style={{ width: '14%', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01</td>
                    <td>
                      <strong>Event Registration &amp; Participation Pass</strong>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {receiptData.eventName || 'Participant Entry Pass'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>1</td>
                    <td style={{ textAlign: 'center', color: '#059669', fontWeight: 700 }}>
                      PAID
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#0f172a' }}>
                      {receiptData.registrationFees || '₹0'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Grand Total Banner */}
              <div className="ur-receipt-grand-total">
                <div className="ur-receipt-grand-total-left">
                  <span className="ur-receipt-grand-total-title">Total Amount Paid</span>
                  <span className="ur-receipt-grand-total-sub">
                    Payment Mode: {receiptData.paymentMethod || 'Razorpay Online Checkout'}
                  </span>
                </div>
                <div className="ur-receipt-grand-total-amount">
                  {receiptData.registrationFees || '₹0'}
                </div>
              </div>
            </div>

            {/* 7. Footer, Security Notice & Authorized Signatory */}
            <div className="ur-receipt-footer">
              <div className="ur-receipt-footer-notes">
                <p>
                  <strong>Security &amp; Verification Notice:</strong>
                </p>
                <p>
                  ✓ This receipt is an official, computer-generated payment confirmation issued by Unique Records of Universe.
                </p>
                <p>
                  ✓ Retain your <strong>Application ID ({appNumber})</strong> for tracking status and event verification.
                </p>
                <p style={{ marginTop: '4px', fontSize: '8.5px', color: '#94a3b8' }}>
                  Unique Records of Universe © {new Date().getFullYear()}. Divya Prerak Kahaniyan Trust. All rights reserved.
                </p>
              </div>

              <div className="ur-receipt-seal-box">
                <div className="ur-receipt-seal">
                  <span>★ URU ★</span>
                  <span style={{ fontSize: '7px' }}>OFFICIAL</span>
                  <span>SEAL</span>
                </div>
                <div className="ur-receipt-sign-line"></div>
                <p className="ur-receipt-sign-title">Authorized Signatory</p>
                <p className="ur-receipt-sign-org">Unique Records of Universe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="ur-receipt-actions-bar">
          <div className="ur-receipt-actions-left">
            <CheckCircle2 size={16} />
            <span>
              {hasAutoDownloaded
                ? 'Receipt auto-downloaded successfully! 🎉'
                : 'Official Receipt Generated with Authentic Branding'}
            </span>
          </div>

          <div className="ur-receipt-actions-right">
            <button
              type="button"
              className="ur-btn ur-btn-secondary"
              onClick={handlePrint}
            >
              <Printer size={15} /> Print Receipt
            </button>

            <button
              type="button"
              className="ur-btn ur-btn-primary"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 size={15} className="ur-spin" /> Generating PDF...
                </>
              ) : (
                <>
                  <Download size={15} /> Download PDF Receipt
                </>
              )}
            </button>

            {onClose && (
              <button
                type="button"
                className="ur-btn ur-btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPaymentReceipt;
