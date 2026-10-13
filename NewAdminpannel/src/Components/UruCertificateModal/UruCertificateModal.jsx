import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import {
  X,
  Download,
  UploadCloud,
  Printer,
  Sparkles,
  Edit3,
  CheckCircle,
  Eye,
  Loader2,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import UruCertificate from '../UruCertificate/UruCertificate';
import API from '../../api/axiosInstance';
import './UruCertificateModal.css';

const UruCertificateModal = ({ isOpen, onClose, record, onCertificateUploaded }) => {
  const certificateRef = useRef(null);

  // Initial state derived dynamically from record data
  const [formData, setFormData] = useState({
    appNo: '',
    regNo: '',
    category: '',
    recordType: 'Unique Record',
    applicantName: '',
    location: '',
    qrUrl: '',
    digitizationDate: '',
    existingBase: 'Milky Way Galaxy',
    taglineHindi: 'एक अनोखा प्रयास, एक कदम और (विश्वास से परे सफलता की ओर)',
  });

  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' or 'customize'
  const [scale, setScale] = useState(0.52); // Default to 52% so entire certificate fits on screen
  const [successToast, setSuccessToast] = useState('');

  // Populate data whenever record changes
  useEffect(() => {
    if (record) {
      const appNumber = record.appNo || record.applicationNumber || 'URU5924';
      const cleanNum = appNumber.replace(/\D/g, '') || (record._id ? record._id.slice(-4) : '1185');
      const generatedRegNo = record.regNo || `SCUU12VU${cleanNum.padStart(4, '0')}`;

      // Format location: District / City, State, Country
      const locParts = [
        record.district || record.city,
        record.state,
        record.country || 'India',
      ].filter(Boolean);
      const formattedLoc = locParts.length > 0 ? locParts.join(', ') : (record.address || 'India');

      // Format date
      let formattedDate = '28 August 2025';
      try {
        const rawDate = record.date || record.createdAt;
        if (rawDate) {
          formattedDate = new Date(rawDate).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
        }
      } catch (e) {}

      // Achiever Verification URL
      const achieverId = record._id || record.id || appNumber;
      const verificationUrl = `https://ouruniverse.in/achiever/${achieverId}`;

      setFormData({
        appNo: appNumber,
        regNo: generatedRegNo,
        category: record.category || record.formCategory || record.position || 'Education',
        recordType: 'Unique Record',
        applicantName: (record.name || record.applicantName || 'Applicant Name').toUpperCase(),
        location: formattedLoc,
        qrUrl: verificationUrl,
        digitizationDate: formattedDate,
        existingBase: 'Milky Way Galaxy',
        taglineHindi: 'एक अनोखा प्रयास, एक कदम और (विश्वास से परे सफलता की ओर)',
      });
      setScale(0.52); // reset to comfortable fit on open
    }
  }, [record]);

  if (!isOpen || !record) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(1.0, +(prev + 0.08).toFixed(2)));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.35, +(prev - 0.08).toFixed(2)));
  };

  // Generate High-Res Canvas Helper using onclone to capture unscaled A4 without touching on-screen preview
  const generateCanvas = async () => {
    const element = document.getElementById('uru-printable-certificate');
    if (!element) throw new Error('Certificate preview element not found.');

    const canvas = await html2canvas(element, {
      width: 760,
      height: 1075,
      scale: 2, // Generates clean 1520 x 2150 high-res A4 image
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 760,
      windowHeight: 1075,
      onclone: (clonedDoc) => {
        const clonedCert = clonedDoc.getElementById('uru-printable-certificate');
        const clonedScaler = clonedCert?.parentElement;

        if (clonedScaler) {
          clonedScaler.style.width = '760px';
          clonedScaler.style.height = '1075px';
          clonedScaler.style.transform = 'none';
          clonedScaler.style.position = 'static';
          clonedScaler.style.overflow = 'visible';
        }

        if (clonedCert) {
          clonedCert.style.width = '760px';
          clonedCert.style.minWidth = '760px';
          clonedCert.style.maxWidth = '760px';
          clonedCert.style.height = '1075px';
          clonedCert.style.minHeight = '1075px';
          clonedCert.style.maxHeight = '1075px';
          clonedCert.style.transform = 'none';
          clonedCert.style.position = 'static';
          clonedCert.style.top = '0';
          clonedCert.style.left = '0';
        }
      },
    });

    return canvas;
  };

  // Download High-Res PNG
  const handleDownloadPNG = async () => {
    try {
      setDownloading(true);
      const canvas = await generateCanvas();
      const link = document.createElement('a');
      link.download = `Certificate_${formData.appNo}_${formData.applicantName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      setSuccessToast('Certificate image downloaded successfully!');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      console.error('Error generating certificate image:', err);
      alert('Failed to generate certificate download: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  // Save and Upload as Official Certificate for Applicant
  const handleSaveAndUpload = async () => {
    try {
      setSaving(true);
      const recordId = record._id || record.id || record.appNo || record.applicationNumber;
      const canvas = await generateCanvas();

      // Convert canvas to Blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          alert('Could not create certificate image blob.');
          setSaving(false);
          return;
        }

        const fileName = `Official_Certificate_${formData.appNo}.png`;
        const file = new File([blob], fileName, { type: 'image/png' });

        const uploadFormData = new FormData();
        uploadFormData.append('certificate', file);
        uploadFormData.append('regNo', formData.regNo);
        uploadFormData.append('category', formData.category);

        try {
          const res = await API.post(`/uru/upload-certificate/${recordId}`, uploadFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });

          const certUrl = res.data?.certificateUrl || res.data?.data?.certificateUrl;
          if (onCertificateUploaded) {
            onCertificateUploaded(recordId, certUrl || fileName);
          }

          setSuccessToast(`Certificate uploaded and linked to application ${formData.appNo}!`);
          setTimeout(() => {
            setSuccessToast('');
            onClose();
          }, 2000);
        } catch (uploadErr) {
          console.error('Failed to upload certificate:', uploadErr);
          alert(uploadErr.response?.data?.message || 'Failed to upload certificate.');
        } finally {
          setSaving(false);
        }
      }, 'image/png', 0.95);
    } catch (err) {
      console.error('Error in save & upload:', err);
      alert('Failed to generate and upload certificate.');
      setSaving(false);
    }
  };

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="uru-cert-modal-overlay">
      <div className="uru-cert-modal-card">
        {/* Header */}
        <div className="uru-cert-modal-header">
          <div className="uru-cert-modal-title-group">
            <div className="uru-cert-modal-badge">
              <Sparkles size={14} /> Certificate Generator
            </div>
            <h2>Official Certificate for {formData.appNo}</h2>
          </div>

          <div className="uru-cert-modal-header-actions">
            {/* Zoom Controls */}
            {activeTab === 'preview' && (
              <div className="uru-cert-zoom-toolbar">
                <button
                  type="button"
                  className="uru-cert-zoom-btn"
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  disabled={scale <= 0.35}
                >
                  <ZoomOut size={14} />
                </button>

                <span className="uru-cert-zoom-level">{Math.round(scale * 100)}%</span>

                <button
                  type="button"
                  className="uru-cert-zoom-btn"
                  onClick={handleZoomIn}
                  title="Zoom In"
                  disabled={scale >= 1.0}
                >
                  <ZoomIn size={14} />
                </button>

                <button
                  type="button"
                  className={`uru-cert-zoom-preset ${scale === 0.52 ? 'active' : ''}`}
                  onClick={() => setScale(0.52)}
                  title="Fit entire certificate on screen"
                >
                  <Maximize2 size={12} /> Fit
                </button>

                <button
                  type="button"
                  className={`uru-cert-zoom-preset ${scale === 0.75 ? 'active' : ''}`}
                  onClick={() => setScale(0.75)}
                >
                  75%
                </button>

                <button
                  type="button"
                  className={`uru-cert-zoom-preset ${scale === 1.0 ? 'active' : ''}`}
                  onClick={() => setScale(1.0)}
                >
                  100%
                </button>
              </div>
            )}

            {/* View / Customize Tab Switcher */}
            <div className="uru-cert-tab-group">
              <button
                className={`uru-cert-tab ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                <Eye size={14} /> Preview
              </button>
              <button
                className={`uru-cert-tab ${activeTab === 'customize' ? 'active' : ''}`}
                onClick={() => setActiveTab('customize')}
              >
                <Edit3 size={14} /> Customize Fields
              </button>
            </div>

            <button className="uru-cert-close-btn" onClick={onClose} title="Close Modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successToast && (
          <div className="uru-cert-success-toast">
            <CheckCircle size={16} />
            <span>{successToast}</span>
          </div>
        )}

        {/* Body Area */}
        <div className="uru-cert-modal-body">
          {/* Left / Main: Live Certificate Canvas */}
          <div className="uru-cert-preview-pane">
            <div className="uru-cert-preview-scroller">
              <UruCertificate data={formData} ref={certificateRef} scale={scale} />
            </div>
          </div>

          {/* Right: Customization Drawer */}
          {activeTab === 'customize' && (
            <div className="uru-cert-editor-pane">
              <h3>Certificate Details</h3>
              <p className="uru-cert-editor-desc">
                Fine-tune any field below. Changes update the certificate live.
              </p>

              <div className="uru-cert-form-grid">
                <div className="uru-cert-form-field">
                  <label>Applicant Full Name</label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field">
                  <label>Application Number</label>
                  <input
                    type="text"
                    name="appNo"
                    value={formData.appNo}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field">
                  <label>Registration Number (Regd. No)</label>
                  <input
                    type="text"
                    name="regNo"
                    value={formData.regNo}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field">
                  <label>Record Type</label>
                  <input
                    type="text"
                    name="recordType"
                    value={formData.recordType}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field">
                  <label>Location (City, State, Country)</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field">
                  <label>Digitization Date</label>
                  <input
                    type="text"
                    name="digitizationDate"
                    value={formData.digitizationDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field">
                  <label>Existing Base</label>
                  <input
                    type="text"
                    name="existingBase"
                    value={formData.existingBase}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field full-width">
                  <label>QR Code Verification Link</label>
                  <input
                    type="text"
                    name="qrUrl"
                    value={formData.qrUrl}
                    onChange={handleChange}
                  />
                </div>

                <div className="uru-cert-form-field full-width">
                  <label>Hindi Tagline (Top-Right)</label>
                  <input
                    type="text"
                    name="taglineHindi"
                    value={formData.taglineHindi}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="uru-cert-modal-footer">
          <div className="uru-cert-footer-hint">
            Tip: <strong>Save & Upload as Official</strong> attaches this certificate directly to the applicant account for instant dashboard download.
          </div>

          <div className="uru-cert-footer-actions">
            <button
              type="button"
              className="uru-cert-btn-secondary"
              onClick={handlePrint}
              title="Print Certificate"
            >
              <Printer size={15} /> Print
            </button>

            <button
              type="button"
              className="uru-cert-btn-download"
              onClick={handleDownloadPNG}
              disabled={downloading}
            >
              {downloading ? (
                <>
                  <Loader2 size={15} className="cert-spin" /> Preparing...
                </>
              ) : (
                <>
                  <Download size={15} /> Download PNG
                </>
              )}
            </button>

            <button
              type="button"
              className="uru-cert-btn-primary"
              onClick={handleSaveAndUpload}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 size={15} className="cert-spin" /> Saving & Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={16} /> Save & Upload as Official Certificate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UruCertificateModal;
