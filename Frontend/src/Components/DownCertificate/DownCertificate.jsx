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

  // ✅ Utility function to format date like "8th Aug 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = (day % 10 === 1 && day !== 11) ? "st" :
                   (day % 10 === 2 && day !== 12) ? "nd" :
                   (day % 10 === 3 && day !== 13) ? "rd" : "th";
    const options = { month: "short", year: "numeric" };
    return `${day}${suffix} ${date.toLocaleDateString("en-US", options)}`;
  };

  return (
    <div className="Down-Certificate-Wrapper">
      {certificates.map((certificate) => (
        <div key={certificate._id} className="Down-Certificate-Card">
          <h1 className="Down-Certificate-Heading"> Download Your Certificate</h1>
          
          <p className="Down-Certificate-Application-No">
            Application No.: <span>{certificate.applicationNumber}</span>
          </p>

          {/* ✅ New Application Date Section */}
          <p className="Down-Certificate-Date">
            Application Date: <span>{formatDate(certificate.createdAt)}</span>
          </p>

          <p className="Down-Certificate-Applicant-Name">
            Applicant Name: <span>{certificate.applicantName}</span>
          </p>

          <p className="Down-Certificate-Description">
            {verifiedCertificates[certificate._id]
              ? 'Congratulations on your achievement! Click below to download your certificate.'
              : 'After verification, acceptance and successful receipt of the prescribed fee, the button to download the digital certificate of Unique Records of Universe holder will be enabled. Please wait till then.'}
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
