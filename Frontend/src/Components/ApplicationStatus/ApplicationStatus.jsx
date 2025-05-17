import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplicationStatus.css';
import { FaCheckCircle } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { API_URL } from '../../Api'; // Import API_URL

const ApplicationStatus = () => {
  const [status, setStatus] = useState('');
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const getStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/uru/application-status`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatus(response.data.status);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    getStatus();
  }, []);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await axios.post(`${API_URL}/uru/create-order`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrderId(response.data.id);
      const options = {
        key: 'rzp_live_1gSA9RbSjj0sEj',
        amount: response.data.amount,
        currency: response.data.currency,
        name: 'Unique Record Of Universe',
        description: 'Payment for Application',
        order_id: response.data.id,
        handler: async (response) => {
          try {
            await axios.post(`${API_URL}/uru/verify-payment`, response, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            alert('Payment successful');
          } catch (error) {
            setError(error.message);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#F37254',
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError(error.message);
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="Application-status-wrapper">
      <div className="Application-status-card">
        <h2 className="Application-status-heading">Application Status Tracker</h2>
        <p className="Application-status-description">
          Follow your application's journey from submission to final payment. Stay updated every step of the way.
        </p>

        <div className="Application-status-timeline">
          <div className={`Application-status-step ${status === 'Pending' || status === 'Approved' || status === 'Paid' ? 'completed' : ''}`}>
            <div className="Application-status-circle green">
              <FaCheckCircle className="Application-status-icon" />
            </div>
            <p className="Application-status-label">Application Submitted</p>
          </div>

          <div className="Application-status-line" />

          <div className={`Application-status-step ${status === 'Approved' || status === 'Paid' ? 'completed' : ''}`}>
            <div className="Application-status-circle green">
              <FaCheckCircle className="Application-status-icon" />
            </div>
            <p className="Application-status-label">HR Approved</p>
          </div>

          <div className="Application-status-line" />

          <div className={`Application-status-step ${status === 'Approved' || status === 'Paid' ? 'completed' : ''}`}>
            <div className="Application-status-circle green">
              <FaCheckCircle className="Application-status-icon" />
            </div>
            <p className="Application-status-label">Document Verified</p>
          </div>

          <div className="Application-status-line" />

          <div className={`Application-status-step final ${status === 'Approved' || status === 'Paid' ? 'completed' : ''}`}>
            <div className={`Application-status-circle ${status === 'Approved' ? 'yellow' : status === 'Paid' ? 'green' : ''}`}>
              <FaCheckCircle className="Application-status-icon" />
            </div>
            <p className="Application-status-label">Approved</p>
          </div>

          <div className="Application-status-line" />

          <div className={`Application-status-step payment ${status === 'Paid' ? 'completed' : ''}`}>
            <div className="Application-status-circle blue" onClick={handlePayment}>
              <MdPayment className="Application-status-icon" />
            </div>
            <p className="Application-status-label">Make Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;