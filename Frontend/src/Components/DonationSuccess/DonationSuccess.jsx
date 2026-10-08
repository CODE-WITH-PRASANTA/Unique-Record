import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './DonationSuccess.css';
import logo from '../../assets/UNQUE.png';

const DonationSuccess = () => {
  const { state } = useLocation();
  const {
    name,
    amount,
    paymentId,
    orderId,
    paymentNumber,
    certificate,
    panNumber,
    email,
    phone,
    address,
    date,
  } = state || {};
  const navigate = useNavigate();
  const printRef = useRef();

  const handleGoHome = () => {
    navigate("/");
  };

  const handlePrint = () => {
    window.print();
  };

  if (!state) {
    return (
      <div className="donation-success-container">
        <div className="donation-success-wrapper">
          <div className="donation-success-card" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <img src={logo} alt="Logo" className="donation-success-logo" />
            <h2 className="donation-success-heading">Unique Record Of Universe</h2>
            <h3 className="donation-success-title" style={{ marginTop: 15 }}>Donation Receipt</h3>
            <p style={{ marginTop: 15, color: '#64748b', fontSize: 16 }}>
              No recent donation receipt found in this browser session.
            </p>
            <div className="donation-success-buttons" style={{ marginTop: 25, justifyContent: 'center' }}>
              <button className="donation-success-download-btn" onClick={() => navigate('/donate')}>
                💝 Make a Donation
              </button>
              <button className="donation-success-print-btn" onClick={() => navigate('/')}>
                🏠 Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="donation-success-container">
      <div className="donation-success-wrapper" ref={printRef}>
        
        <div className="donation-success-card">
          <img src={logo} alt="Logo" className="donation-success-logo" />
          <h2 className="donation-success-heading">Unique Record Of Universe</h2>
          <p className="donation-success-description">
            <strong>
            Digitally Marking The Extraordinary Achievement
            </strong>
          </p>
          <h3 className="donation-success-title">Donation Success</h3>

          <div className="donation-success-receipt-container">
            <p className="donation-success-top-text">
              Receipt No: <strong>{paymentNumber || paymentId || "N/A"}</strong>
            </p>

            <div className="donation-success-receipt-box">
              <div className="donation-success-receipt-header">
                <span><strong>Receipt / Ref ID:</strong> {paymentNumber || "N/A"}</span>
                <span><strong>Transaction ID:</strong> {paymentId || "N/A"}</span>
              </div>
            
              <div className="donation-success-info-section">
                <div className="donation-success-to">
                  <p><strong>Donor Details:</strong></p>
                  <p><strong>{name || "N/A"}</strong></p>
                  {address && <p>{address}</p>}
                  <p>{email || "N/A"}</p>
                  <p>Phone: {phone || "N/A"}</p>
                  {certificate === 'Yes' && (
                    <p style={{ color: '#10b981', fontWeight: 600, marginTop: 4 }}>
                      80G Tax Exemption Applied {panNumber ? `(PAN: ${panNumber})` : ''}
                    </p>
                  )}
                </div>

                <div className="donation-success-from">
                  <p><strong>Organization:</strong></p>
                  <p>Divya Prerak Kahaniya Humanity Research Centre Trust</p>
                  <p>Thekma, District-Azamgarh (Uttar Pradesh) - 276303</p>
                  <p>Email: uruonline2025@gmail.com</p>
                  <p>Phone: +91 9472351693</p>
                </div>
              </div>

              <table className="donation-success-table">
                <thead>
                  <tr>
                    <th>Receipt No.</th>
                    <th>Donor Name</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{paymentNumber || paymentId || "N/A"}</td>
                    <td>{name || "N/A"}</td>
                    <td>{date || new Date().toLocaleDateString('en-IN')}</td>
                    <td>₹{Number(amount || 0).toLocaleString('en-IN')}</td>
                    <td>Razorpay Online Checkout</td>
                  </tr>
                </tbody>
              </table>

              <div className="donation-success-subtotal">
                <span><strong>Subtotal Paid</strong></span>
                <span>₹{Number(amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <p className="donation-success-thank-you">🙏 Thank you for your generous donation! 🙏</p>
        </div>

        <div className="donation-success-buttons">

        <button className="donation-success-print-btn" onClick={handlePrint}>
            🖨️ Print Receipt
          </button>

          <button className="donation-success-download-btn" onClick={handleGoHome}>
            🏠 Go to Home
          </button>
          
        </div>


      </div>
    </div>
  );
};

export default DonationSuccess;
