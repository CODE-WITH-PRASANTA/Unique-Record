import React from "react";
import { useLocation } from "react-router-dom";
import "./PaymentSuccess.css";
import { FaCheckCircle, FaDownload, FaMoneyBillWave, FaPhoneAlt, FaCalendarAlt, FaIdBadge, FaCreditCard } from "react-icons/fa";
import companyLogo from "../../assets/UNQUE.png"; // Import your logo
import html2pdf from "html2pdf.js"; // Import html2pdf.js

const PaymentSuccess = () => {

  
  const location = useLocation();
  const order = location.state?.order || {}; // Get the order details passed through navigate

  // Function to download page as PDF screenshot
  const downloadReceiptAsPDF = () => {
    const element = document.getElementById("payment-success-card"); // Get the card container

    const options = {
      margin:       10,
      filename:     "payment_receipt.pdf",
      image:        { type: "jpeg", quality: 0.98 },
      html2canvas:  { scale: 4 },
      jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card" id="payment-success-card"> {/* Add ID for capturing */} 
        {/* Company Logo */}
        <div className="payment-success-header">
          <img src={companyLogo} alt="Company Logo" className="payment-success-logo" />
          <h2 className="payment-success-name-heading"><span>Unique </span>Records of Universe </h2>
        </div>

        {/* Success Icon */}
        <div className="payment-success-icon">
          <FaCheckCircle className="payment-success-check-icon" />
        </div>

        <h2 className="payment-success-title">Payment Successful!</h2>
        <p className="payment-success-message">Thank you for your payment. Your transaction was completed successfully.</p>

        {/* Amount Section */}
        <div className="payment-success-amount">
          <span className="payment-success-label">Total Paid</span>
          <h1 className="payment-success-value">
            {order.currency || "INR"} {order.amount ? order.amount.toLocaleString() : "0.00"}
          </h1>
        </div>

        {/* Payment Details */}
        <div className="payment-success-details">
          <div className="payment-success-detail-box">
            <FaIdBadge className="payment-success-detail-icon" />
            <span className="payment-success-detail-label">Order ID</span>
            <p className="payment-success-detail-value">{order.orderId || "N/A"}</p>
          </div>
          <div className="payment-success-detail-box">
            <FaMoneyBillWave className="payment-success-detail-icon" />
            <span className="payment-success-detail-label">Payment ID</span>
            <p className="payment-success-detail-value">{order.paymentId || "N/A"}</p>
          </div>
          <div className="payment-success-detail-box">
            <FaPhoneAlt className="payment-success-detail-icon" />
            <span className="payment-success-detail-label">Phone</span>
            <p className="payment-success-detail-value">{order.phone || "N/A"}</p>
          </div>
          <div className="payment-success-detail-box">
            <FaCalendarAlt className="payment-success-detail-icon" />
            <span className="payment-success-detail-label">Transaction Date</span>
            <p className="payment-success-detail-value">{order.date || "N/A"}</p>
          </div>
          <div className="payment-success-detail-box">
            <FaCreditCard className="payment-success-detail-icon" />
            <span className="payment-success-detail-label">Payment Method</span>
            <p className="payment-success-detail-value">{order.method || "N/A"}</p>
          </div>
          <div className="payment-success-detail-box">
            <span className="payment-success-detail-label">Status</span>
            <p className={`payment-success-status ${(order.status || "PENDING").toLowerCase()}`}>
              {order.status || "PENDING"}
            </p>
          </div>
        </div>

        {/* Download Receipt */}
        <button className="payment-success-download-btn" onClick={downloadReceiptAsPDF}>
          <FaDownload className="payment-success-download-icon" /> Download Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
