import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../Api';
import { 
  Search, 
  RotateCcw, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  Check,
  ShieldCheck,
  FileCheck,
  Sparkles,
  Info
} from 'lucide-react';
import './EventStatus.css';

const EventStatus = () => {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('appId') || searchParams.get('id') || searchParams.get('applicationNumber') || '';

  const [appNumber, setAppNumber] = useState(initialId);
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchStatus = useCallback(async (targetNumber) => {
    const query = (targetNumber || '').trim().toUpperCase();
    if (!query) {
      setErrorMessage('Please enter an Application ID (e.g. EVT2610294).');
      setStatusResult(null);
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await axios.get(`${API_URL}/event-registrations/track/${encodeURIComponent(query)}`);
      if (res.data?.success && res.data?.data) {
        setStatusResult(res.data.data);
      } else {
        setErrorMessage(res.data?.message || 'Application not found.');
        setStatusResult(null);
      }
    } catch (err) {
      console.error('Error tracking status:', err);
      const msg = err.response?.data?.message || `No application found for "${query}". Please check your Application ID and try again.`;
      setErrorMessage(msg);
      setStatusResult(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialId) {
      setAppNumber(initialId);
      fetchStatus(initialId);
    }
  }, [initialId, fetchStatus]);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    fetchStatus(appNumber);
  };

  const handleReset = () => {
    setAppNumber('');
    setStatusResult(null);
    setErrorMessage('');
    setCopied(false);
  };

  const handleCopyId = async (id) => {
    if (!id) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(id);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = id;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard copy fallback error:', err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle2 size={16} />;
      case 'Refund':
        return <RotateCcw size={16} />;
      case 'Under Process':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const statusKey = (statusResult?.status || 'Pending').replace(/\s+/g, '-');

  return (
    <div className="es-main-container">
      <div className="es-glow-orb es-orb-1"></div>
      <div className="es-glow-orb es-orb-2"></div>

      <div className="es-status-card">
        <div className="es-card-inner">
          <div className="es-icon-badge">
            <Search size={28} />
          </div>

          <h2 className="es-title">Event Application Tracker</h2>
          <p className="es-subtitle">
            Enter your unique Application ID (e.g. <strong>EVT26XXXXX</strong>) to verify your registration status in real time.
          </p>

          <form className="es-form-group" onSubmit={handleTrackSubmit}>
            <div className="es-input-wrapper">
              <Search className="es-input-icon" size={18} />
              <input
                type="text"
                className="es-text-input"
                placeholder="Enter Application ID (e.g. EVT2610294)"
                value={appNumber}
                onChange={(e) => {
                  setAppNumber(e.target.value.toUpperCase());
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </div>
            <button type="submit" className="es-track-btn" disabled={isLoading}>
              {isLoading ? 'Checking...' : 'Track Status'}
            </button>
          </form>

          {errorMessage && (
            <div className="es-error-alert">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Result Panel */}
          {statusResult && (
            <div className="es-result-panel">
              
              {/* Top Dossier Bar */}
              <div className="es-result-header">
                <div>
                  <div className="es-result-id-group">
                    <span className="es-result-id">Application ID</span>
                    <span className="es-id-pill">{statusResult.applicationNumber || statusResult.id}</span>
                    <button
                      type="button"
                      className="es-copy-btn"
                      onClick={() => handleCopyId(statusResult.applicationNumber || statusResult.id)}
                      title="Copy ID"
                    >
                      {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <h3 className="es-result-name">{statusResult.applicantName}</h3>
                </div>

                <span className={`es-status-badge ${statusKey}`}>
                  {getStatusIcon(statusResult.status)}
                  {statusResult.status}
                </span>
              </div>

              {/* Progress Tracker Bar */}
              {statusResult.status !== 'Refund' ? (
                <div className="es-timeline-container">
                  <div className="es-timeline-steps es-three-steps">
                    <div className={`es-timeline-step ${statusResult.step >= 1 ? (statusResult.step > 1 ? 'completed' : 'active') : ''}`}>
                      <div className="es-step-circle">1</div>
                      <div className="es-step-label">Submitted</div>
                    </div>
                    <div className={`es-timeline-step ${statusResult.step >= 2 ? (statusResult.step > 2 ? 'completed' : 'active') : ''}`}>
                      <div className="es-step-circle">2</div>
                      <div className="es-step-label">Under Process</div>
                    </div>
                    <div className={`es-timeline-step ${statusResult.step >= 3 ? 'completed active' : ''}`}>
                      <div className="es-step-circle">3</div>
                      <div className="es-step-label">Approved</div>
                    </div>
                  </div>

                  <div className="es-progress-bar-bg">
                    <div 
                      className="es-progress-bar-fill" 
                      style={{ 
                        width: `${Math.min(100, Math.max(16, ((statusResult.step) / 3) * 100))}%`,
                        background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 100%)'
                      }} 
                    />
                  </div>
                </div>
              ) : (
                <div className="es-refund-banner">
                  <RotateCcw size={20} color="#ea580c" />
                  <div>
                    <strong>Registration Refunded</strong>
                    <p>{statusResult.message || 'Your event registration fee has been refunded.'}</p>
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="es-info-grid">
                <div className="es-info-card">
                  <Calendar size={18} />
                  <div>
                    <span>Event Name</span>
                    <strong>{statusResult.eventName}</strong>
                  </div>
                </div>

                <div className="es-info-card">
                  <CreditCard size={18} />
                  <div>
                    <span>Registration Fee</span>
                    <strong style={{ color: '#059669' }}>{statusResult.registrationFees || '₹0'}</strong>
                  </div>
                </div>

                <div className="es-info-card">
                  <Phone size={18} />
                  <div>
                    <span>Contact WhatsApp</span>
                    <strong>{statusResult.whatsappNumber || '-'}</strong>
                  </div>
                </div>

                <div className="es-info-card">
                  <MapPin size={18} />
                  <div>
                    <span>Location</span>
                    <strong>{statusResult.district ? `${statusResult.district}, ${statusResult.state}` : '-'}</strong>
                  </div>
                </div>

                <div className="es-info-card">
                  <Clock size={18} />
                  <div>
                    <span>Registered Date</span>
                    <strong>{formatDate(statusResult.registrationDate)}</strong>
                  </div>
                </div>

                <div className="es-info-card">
                  <Mail size={18} />
                  <div>
                    <span>Registered Email</span>
                    <strong>{statusResult.email || '-'}</strong>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="es-message-box">
                <p>
                  <strong>Official Status Update:</strong> {statusResult.message}
                </p>
              </div>

              {/* Reset Button */}
              <button type="button" className="es-reset-btn" onClick={handleReset}>
                <RotateCcw size={16} /> Track Another Application
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventStatus;