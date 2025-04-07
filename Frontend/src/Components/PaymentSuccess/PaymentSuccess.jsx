import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./PaymentSuccess.css";
import { FaCheckCircle, FaDownload, FaMoneyBillWave, FaPhoneAlt, FaCalendarAlt, FaIdBadge, FaCreditCard } from "react-icons/fa";
import companyLogo from "../../assets/UNQUE.png";
import html2pdf from "html2pdf.js";
import { API_URL } from '../../Api'; // 👈 Adjust the path based on your folder structure


const PaymentSuccess = () => {
  const location = useLocation();
  const order = location.state?.order || {};
  const formData = location.state?.formData || {};
  
  const hasRegistered = useRef(false); // <== track if already posted

  useEffect(() => {
    const registerEvent = async () => {
      try {
        const response = await axios.post(`${API_URL}/registerevent/register`, {
          eventName: formData.eventName || "N/A",
          applicantName: formData.applicantName || "N/A",
          sex: formData.sex || "N/A",
          dateOfBirth: formData.dob || "N/A",
          phone: order.phone || "N/A",
          pinCode: formData.pinCode || "N/A",
          district: formData.district || "N/A",
          state: formData.state || "N/A",
          email: formData.email || "N/A",
          website: formData.website || "N/A",
          education: formData.education || "N/A",
          skills: formData.skills || "N/A",
          bioDataUrl: formData.biodataUrl || "N/A",
          passportPhotoUrl: formData.photoUrl || "N/A",
          orderId: order.orderId || "N/A",
          paymentId: order.paymentId || "N/A",
          amount: order.amount || 0,
          currency: order.currency || "INR",
          method: order.method || "N/A",
          status: order.status || "PENDING",
        });

        console.log("Registration successful:", response.data);
      } catch (error) {
        console.error("Error registering event:", error.response?.data || error.message);
      }
    };

    if (order.orderId && order.paymentId && !hasRegistered.current) {
      hasRegistered.current = true;
      registerEvent(); // Call the function only once
    }
  }, [order, formData]);
  const downloadReceiptAsPDF = () => {
    const element = document.getElementById("payment-success-card");

    const options = {
      margin: 10,
      filename: "payment_receipt.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 4 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="payment-success-container">
      <div className="payment-success-card" id="payment-success-card">
        <div className="payment-success-header">
          <img src={companyLogo} alt="Company Logo" className="payment-success-logo" />
          <h2 className="payment-success-name-heading"><span>Unique </span>Records of Universe</h2>
        </div>

        <div className="payment-success-icon">
          <FaCheckCircle className="payment-success-check-icon" />
        </div>

        <h2 className="payment-success-title">Payment Successful!</h2>
        <p className="payment-success-message">Thank you for your payment. Your transaction was completed successfully.</p>

        <div className="payment-success-amount">
          <span className="payment-success-label">Total Paid</span>
          <h1 className="payment-success-value">
            {order.currency || "INR"} {order.amount ? order.amount.toLocaleString() : "0.00"}
          </h1>
        </div>

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

        <button className="payment-success-download-btn" onClick={downloadReceiptAsPDF}>
          <FaDownload className="payment-success-download-icon" /> Download Receipt
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
