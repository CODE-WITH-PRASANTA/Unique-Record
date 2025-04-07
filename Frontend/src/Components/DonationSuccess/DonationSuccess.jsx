import React from "react";
import { useLocation } from "react-router-dom";
import './DonationSuccess.css';

const DonationSuccess = () => {
  const { state } = useLocation();
  const {
    name,
    amount,
    paymentId,
    certificate,
    email,
    phone,
  } = state || {};

  const handleDownload = () => {
    const element = document.getElementById("donation-success-receipt");
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Donation Receipt</title>
        </head>
        <body>${element.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="donation-success-container">
      <h2 className="donation-success-heading">🎉 Thank You for Your Donation!</h2>
      <p className="donation-success-subheading">Your payment was successful.</p>

      <div id="donation-success-receipt" className="donation-success-receipt">
        <h3 className="donation-success-receipt-title">Donation Receipt</h3>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Amount Donated:</strong> ₹{amount}</p>
        <p><strong>Payment ID:</strong> {paymentId}</p>
        <p><strong>80G Certificate Required:</strong> {certificate}</p>
      </div>

      <button onClick={handleDownload} className="donation-success-button">📄 Download Receipt</button>
    </div>
  );
};

export default DonationSuccess;
