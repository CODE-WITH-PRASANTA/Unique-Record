import React, { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './DonationSuccess.css';
import logo from '../../assets/UNQUE.png';

const DonationSuccess = () => {
  const { state } = useLocation();
  const { name, amount, paymentId, email, phone } = state || {};
  const navigate = useNavigate();
  const printRef = useRef();

  const handleGoHome = () => {
    navigate("/");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="donation-success-container">
      <div className="donation-success-wrapper" ref={printRef}>
        
        <div className="donation-success-card">
          <img src={logo} alt="Logo" className="donation-success-logo" />
          <h2 className="donation-success-heading">Unique Record Of Universe</h2>
          <p className="donation-success-description">
            <strong>
              Unique Records of Universe<br />Digitally Marking The Extraordinary Achievement
            </strong>
          </p>
          <h3 className="donation-success-title">Donation Success</h3>


          <div className="donation-success-receipt-container">
            <p className="donation-success-top-text"> Payment ID: <strong>{paymentId || "N/A"}</strong></p>

            <div className="donation-success-receipt-box">
              <div className="donation-success-receipt-header">
                <span><strong>Transaction ID:</strong> {paymentId || "N/A"}</span>
              </div>
            
              <div className="donation-success-info-section">
                <div className="donation-success-to">
                  <p><strong>To:</strong></p>
                  <p><strong>{name || "N/A"}</strong></p>
                  <p>{email || "N/A"}</p>
                  <p>Phone: {phone || "N/A"}</p>
                </div>

                <div className="donation-success-from">
                  <p><strong>From:</strong></p>
                  
                  <p>Thekma,<br />District-Azamgarh (Uttar Pradesh)<br />Pin- 276303</p>
                  <p>Email: uruonline2025@gmail.com</p>
                  <p>Phone: +91 9472351693</p>
                </div>
              </div>

              <table className="donation-success-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Total Amount</th>
                    <th>Payment Method</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{paymentId || "N/A"}</td>
                    <td>{name || "N/A"}</td>
                    <td>{new Date().toLocaleDateString()}</td>
                    <td>Rs. {amount || "N/A"}</td>
                    <td>Online Payment</td>
                  </tr>
                </tbody>
              </table>

              <div className="donation-success-subtotal">
                <span><strong>Subtotal</strong></span>
                <span>Rs. {amount || "N/A"}</span>
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
