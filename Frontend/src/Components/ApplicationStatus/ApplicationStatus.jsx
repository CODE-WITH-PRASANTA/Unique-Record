import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplicationStatus.css';
import { FaCheckCircle, FaEllipsisV } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { API_URL } from '../../Api';
import Swal from 'sweetalert2';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const token = localStorage.getItem('token'); 

useEffect(() => {
  const fetchApplications = async () => {
    try {
      const response = await axios.get(`${API_URL}/uru/fetch-applied-uru-by-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ Sort by latest created date
      const sortedApps = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setApplications(sortedApps);
    } catch (error) {
      console.error(error);
    }
  };
  fetchApplications();
}, []);


  const handlePayment = async (applicationNumber) => {
    try {
      const { data: appDetails } = await axios.get(
        `${API_URL}/uru/get-uru-by-application-number/${applicationNumber}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (appDetails.paymentStatus === 'Success') {
        Swal.fire({
          title: "Payment Status",
          html: `<b>Payment Already Done!</b><br>Please wait 24 hours to verify and receive your certificate.`,
          icon: "info",
          confirmButtonText: "Okay",
          confirmButtonColor: "#4CAF50",
        });
        return;
      }

      if (!appDetails.price || appDetails.price <= 0) {
        Swal.fire({
          title: "Please Wait for Approval",
          html: `<b>Your application is under review.</b><br>Please wait <strong>24 hours</strong> for admin approval.<br>Once approved, you will be able to make the payment.`,
          icon: "info",
          confirmButtonText: "Okay",
          confirmButtonColor: "#4CAF50",
        });
        return;
      }

      // Step 1: Create Razorpay order
      const { data: orderData } = await axios.post(
        `${API_URL}/uru/create-razorpay-order`,
        { applicationNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_live_1gSA9RbSjj0sEj", 
        amount: orderData.amount,
        currency: "INR",
        name: "URU Application",
        description: "Application Payment",
        order_id: orderData.orderId,
        handler: async (response) => {
          const verifyRes = await axios.post(
            `${API_URL}/uru/verify-razorpay-payment`,
            {
              applicationNumber,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            Swal.fire({
              title: "🎉 Payment Successful!",
              html: `
                <p style="font-size:16px; margin:0;">Hey <b>${appDetails.applicantName}</b>,</p>
                <p style="margin:8px 0;">Your transaction is <b style="color:#4CAF50;">successful</b> ✅</p>
                <p style="font-size:14px; background:#f4f6f8; padding:10px; border-radius:6px;">
                  Transaction ID: <b style="color:#333;">${response.razorpay_payment_id}</b>
                </p>
              `,
              icon: "success",
              confirmButtonText: "Okay",
              confirmButtonColor: "#4CAF50",
            });

            setApplications((prev) =>
              prev.map((a) =>
                a.applicationNumber === applicationNumber
                  ? { ...a, paymentStatus: 'Success', transactionId: response.razorpay_payment_id }
                  : a
              )
            );
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: appDetails.applicantName,
          email: appDetails.emailId,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="Application-status-wrapper">
      {applications.map((application) => (
        <div key={application.applicationNumber} className="Application-status-card">
          <div className="Application-status-header">
           <div className="Application-status-header-left">
              <p className="Application-status-label">Application No.</p>
              <p className="Application-status-value">{application.applicationNumber}</p>

              {/* ✅ Application Date */}
              <p className="Application-status-date">
                Date: {new Date(application.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }).replace(/(\d{1,2})(?=\s)/, (d) => {
                  const day = parseInt(d);
                  if (day % 10 === 1 && day !== 11) return day + "st";
                  if (day % 10 === 2 && day !== 12) return day + "nd";
                  if (day % 10 === 3 && day !== 13) return day + "rd";
                  return day + "th";
                })}
              </p>

            </div>

            <div className="Application-status-header-right">
              <p className="Application-status-label">Applicant Name</p>
              <p className="Application-status-value">{application.applicantName}</p>
              <div className="Application-status-options">
                <FaEllipsisV className="Application-status-options-icon" />
                <div className="Application-status-options-menu">
                  <a href={``} target="_blank" rel="noopener noreferrer">
                    Download Your Application Form
                  </a>
                </div>
              </div>
            </div>
          </div>

          <h2 className="Application-status-heading">Application Status Tracker</h2>
          <p className="Application-status-description">
            Follow your application's journey from submission to final payment. Stay updated every step of the way.
          </p>

          <div className="Application-status-info">
            <p className="Application-status-label">Position:</p>
            <p className="Application-status-value">{application.position}</p>

            <p className="Application-status-label">Payment Status:</p>
            <p className={`Application-status-value ${application.paymentStatus === 'Success' ? 'success' : 'pending'}`}>
              {application.paymentStatus === 'Success' ? 'Payment Successful' : 'Payment Pending'}
            </p>

           <p className="Application-status-label">Payment Allotment:</p>
            {application.price && application.price > 0 ? (
              <p className="Application-status-value">₹{application.price}</p>
            ) : (
              <p className="Application-status-wait">⏳ Wait 24 Hr for verifying and allot your payment</p>
            )}

          </div>

          {/* Timeline */}
          <div className="Application-status-timeline">
            <div className={`Application-status-step ${['Pending', 'Approved', 'Paid'].includes(application.status) ? 'completed' : ''}`}>
              <div className="Application-status-circle green">
                <FaCheckCircle className="Application-status-icon" />
              </div>
              <p className="Application-status-label">Application Submitted</p>
            </div>

            <div className="Application-status-line" />

            <div className={`Application-status-step ${['Approved', 'Paid'].includes(application.status) ? 'completed' : ''}`}>
              <div className="Application-status-circle green">
                <FaCheckCircle className="Application-status-icon" />
              </div>
              <p className="Application-status-label">URU Investigator Checks</p>
            </div>

            <div className="Application-status-line" />

            <div className={`Application-status-step ${['Approved', 'Paid'].includes(application.status) ? 'completed' : ''}`}>
              <div className="Application-status-circle green">
                <FaCheckCircle className="Application-status-icon" />
              </div>
              <p className="Application-status-label">Document Verified</p>
            </div>

            <div className="Application-status-line" />

            <div className={`Application-status-step final ${['Approved', 'Paid'].includes(application.status) ? 'completed' : application.status === 'Pending' ? 'pending' : ''}`}>
              <div className={`Application-status-circle ${
                application.status === 'Approved' ? 'green' :
                application.status === 'Pending' ? 'yellow' :
                application.status === 'Paid' ? 'green' : ''
              }`}>
                <FaCheckCircle className="Application-status-icon" />
              </div>
              <p className="Application-status-label">
                {application.status === 'Approved' ? 'Approved' :
                application.status === 'Pending' ? 'Pending Approval' :
                application.status === 'Paid' ? 'Approved & Paid' : ''}
              </p>
            </div>

            <div className="Application-status-line" />
          <div className={`Application-status-step payment ${application.paymentStatus === 'Success' ? 'completed' : ''}`}>
             <div className={`Application-status-step payment`}>
  <div
    className={`Application-status-circle ${application.paymentStatus === 'Success' ? 'green' : 'blink-circle'}`}
    onClick={() => application.paymentStatus !== 'Success' && handlePayment(application.applicationNumber)}
  >
    {application.paymentStatus === 'Success' ? (
      <FaCheckCircle className="Application-status-icon" />
    ) : (
      <MdPayment className="Application-status-icon" />
    )}
  </div>
  <p className={`Application-status-label ${application.paymentStatus === 'Success' ? 'success' : 'pending'}`}>
    {application.paymentStatus === 'Success' ? 'Paid' : 'Make Payment'}
  </p>
</div>

            </div>

          </div>

          {/* ✅ After Payment Success – Show Transaction ID */}
          {application.paymentStatus === 'Success' && application.razorpayPaymentId && (
            <div className="payment-successful">
              <p className="success">🎉 Thank you for your payment!</p>
              <p className="transaction-id">
                Payment ID: <b>{application.razorpayPaymentId}</b>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationStatus;
