import React, { useState, useEffect } from 'react';
import './DownCertificate.css';
import { FaDownload } from 'react-icons/fa';

const DownCertificate = () => {
  // Simulate verification status (replace with actual API or logic if needed)
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Simulate a 24-hour wait (use API call in real-world)
    const timer = setTimeout(() => {
      setIsVerified(true);
    }, 3000); // 3 seconds for demo; replace with real verification logic

    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    const certificateUrl = '/certificates/your-certificate.pdf';
    const link = document.createElement('a');
    link.href = certificateUrl;
    link.download = 'Your_Certificate.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="Down-Certificate-Wrapper">
      <div className="Down-Certificate-Card">
        <h1 className="Down-Certificate-Heading">🎓 Download Your Certificate</h1>
        <p className="Down-Certificate-Description">
          {isVerified
            ? 'Congratulations on your achievement! Click below to download your certificate.'
            : 'Please wait 24 hours while your certificate is being verified. Once verified, the download button will be enabled.'}
        </p>
        <div className="Down-Certificate-Icon-Wrapper">
          <FaDownload className="Down-Certificate-Icon" />
        </div>
        <button
          className="Down-Certificate-Button"
          onClick={handleDownload}
          disabled={!isVerified}
        >
          {isVerified ? 'Download Certificate' : 'Verifying...'}
        </button>
      </div>
    </div>
  );
};

export default DownCertificate;
