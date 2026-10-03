import React, { useState } from 'react';
import './EventStatus.css';

// Mock status data base for demonstration tracking
const MOCK_STATUS_DATABASE = {
  'URU3778': {
    applicantName: 'Prasanta Kumar Khuntia',
    category: 'Unique Record',
    applicationDate: '22nd Sep 2026',
    status: 'Under Verification',
    statusCode: 'verifying',
    step: 2,
    message: 'Your application is currently being verified by our panel of reviewers.'
  },
  'URU6310': {
    applicantName: 'Ankita Nayak',
    category: 'Unique Activity',
    applicationDate: '22nd Sep 2026',
    status: 'Approved & Ready',
    statusCode: 'approved',
    step: 4,
    message: 'Verification complete! Your digital certificate is ready for download.'
  }
};

const EventStatus = () => {
  const [appNumber, setAppNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusResult, setStatusResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = appNumber.trim().toUpperCase();

    if (!trimmedInput) {
      setErrorMessage('Please enter a valid application number.');
      setStatusResult(null);
      return;
    }

    setErrorMessage('');
    setIsLoading(true);
    setStatusResult(null);

    // Simulate network latency for a high-end feel
    setTimeout(() => {
      setIsLoading(false);
      const foundData = MOCK_STATUS_DATABASE[trimmedInput];
      
      if (foundData) {
        setStatusResult({ id: trimmedInput, ...foundData });
      } else {
        // Fallback default response for testing any random ID
        setStatusResult({
          id: trimmedInput,
          applicantName: 'Valued Contributor',
          category: 'Unique Record / Activity',
          applicationDate: 'Recent',
          status: 'Under Review',
          statusCode: 'verifying',
          step: 2,
          message: 'Application registered successfully in the universal archives queue.'
        });
      }
    }, 700);
  };

  const handleReset = () => {
    setAppNumber('');
    setStatusResult(null);
    setErrorMessage('');
  };

  return (
    <div className="es-main-container">
      <div className="es-status-card">
        {/* Background Ambient Glow Accents */}
        <div className="es-glow-orb es-orb-1"></div>
        <div className="es-glow-orb es-orb-2"></div>

        <div className="es-card-inner">
          <div className="es-icon-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <h2 className="es-title">Track Your Event Application</h2>
          <p className="es-subtitle">
            Enter your application number sent to your email to view status.
          </p>

          <form className="es-form-group" onSubmit={handleTrackSubmit}>
            <div className="es-input-wrapper">
              <svg className="es-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7V4h16v3M9 20h6M12 4v16" />
              </svg>
              <input
                type="text"
                className="es-text-input"
                placeholder="Enter Application Number"
                value={appNumber}
                onChange={(e) => {
                  setAppNumber(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
              />
            </div>
            <button type="submit" className="es-track-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="es-loading-wrap">
                  <span className="es-spinner"></span> Checking...
                </span>
              ) : (
                'Track'
              )}
            </button>
          </form>

          {errorMessage && <div className="es-error-alert">{errorMessage}</div>}

          {/* Detailed Status Result Panel */}
          {statusResult && (
            <div className="es-result-panel">
              <div className="es-result-header">
                <div>
                  <span className="es-result-id">Application ID: <strong>{statusResult.id}</strong></span>
                  <h3 className="es-result-name">{statusResult.applicantName}</h3>
                </div>
                <span className={`es-status-badge ${statusResult.statusCode}`}>
                  {statusResult.status}
                </span>
              </div>

              <div className="es-result-meta">
                <span>Category: <strong>{statusResult.category}</strong></span>
                <span>Date: <strong>{statusResult.applicationDate}</strong></span>
              </div>

              <p className="es-result-message">{statusResult.message}</p>

              <button type="button" className="es-reset-btn" onClick={handleReset}>
                Track Another Application 🔄
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventStatus;