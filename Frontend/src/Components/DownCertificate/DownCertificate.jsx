import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DownCertificate.css';
import { FaDownload } from 'react-icons/fa';
import { API_URL } from '../../Api';

const DownCertificate = () => {
  const [certificates, setCertificates] = useState([]);
  const [verifiedCertificates, setVerifiedCertificates] = useState({});
  const token = localStorage.getItem('token'); 

  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token not found');
    // You can redirect the user to the login page here
    return;
  }

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(`${API_URL}/uru/fetch-applied-uru-by-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCertificates(response.data);
      const verified = {};
      response.data.forEach((certificate) => {
        verified[certificate._id] = certificate.certificateUrl !== null && certificate.certificateUrl !== undefined;
      });
      setVerifiedCertificates(verified);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Invalid token');
        // You can redirect the user to the login page here
      } else {
        console.error(error);
      }
    }
  };
  fetchCertificates();
}, []);


 const handleDownload = async (certificate) => {
  try {
    const response = await axios.get(`${API_URL}/uru/download-certificate/${certificate.applicationNumber}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data], { type: response.headers['content-type'] }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      alert('Wait For 24 hour Your Certificate is being in progress');
    } else {
      console.error(error);
    }
  }
};


  return (
    <div className="Down-Certificate-Wrapper">
      {certificates.map((certificate) => (
        <div key={certificate._id} className="Down-Certificate-Card">
          <h1 className="Down-Certificate-Heading"> Download Your Certificate</h1>
          <p className="Down-Certificate-Application-No">
            Application No.: <span>{certificate.applicationNumber}</span>
          </p>
          <p className="Down-Certificate-Applicant-Name">
            Applicant Name: <span>{certificate.applicantName}</span>
          </p>
          <p className="Down-Certificate-Description">
            {verifiedCertificates[certificate._id]
              ? 'Congratulations on your achievement! Click below to download your certificate.'
              : 'Please wait 24 hours while your certificate is being verified. Once verified, the download button will be enabled.'}
          </p>
          <div className="Down-Certificate-Icon-Wrapper">
            <FaDownload className="Down-Certificate-Icon" />
          </div>
          <button
            className="Down-Certificate-Button"
            onClick={() => handleDownload(certificate)}
            disabled={!verifiedCertificates[certificate._id]}
          >
            {verifiedCertificates[certificate._id] ? 'Download Certificate' : 'Verifying...'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default DownCertificate;