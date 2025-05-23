import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplicationStatus.css';
import { FaCheckCircle, FaEllipsisV } from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { API_URL } from '../../Api';
import Swal from 'sweetalert2';


const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token'); // assuming you're storing the token in local storage

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${API_URL}/uru/fetch-applied-uru-by-user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setApplications(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchApplications();
  }, []);

  const handlePayment = async (applicationNumber) => {
    try {
      const { data: appDetails } = await axios.get(`${API_URL}/uru/get-uru-by-application-number/${applicationNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { price, applicantName, emailId } = appDetails;

     if (!price || price <= 0) {
  Swal.fire({
    title: "Please Wait for Approval",
    html: `
      <b>Your application is under review.</b><br>
      Please wait <strong>24 hours</strong> for admin approval.<br>
      Once approved, you will be able to make the payment.
    `,
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
        key: "rzp_live_1gSA9RbSjj0sEj", // Store this securely in .env
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
            alert("Payment successful!");
            setApplications((prev) =>
              prev.map((a) => (a.applicationNumber === applicationNumber ? { ...a, status: "Paid" } : a))
            );
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: applicantName,
          email: emailId,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
  console.error(err);
  Swal.fire({
    title: "Payment Status",
    html: `
      <b>Payment Already Done!</b><br>
      Please wait 24 hours to verify and receive your certificate.
    `,
    icon: "info",
    confirmButtonText: "Okay",
    confirmButtonColor: "#4CAF50",
  });
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
            </div>
            <div className="Application-status-header-right">
              <p className="Application-status-label">Applicant Name</p>
              <p className="Application-status-value">{application.applicantName}</p>
              <div className="Application-status-options">
                <FaEllipsisV className="Application-status-options-icon" />
                <div className="Application-status-options-menu">
                  <a href={`${API_URL}/uru/download-application-form/${application.applicationNumber}`} target="_blank" rel="noopener noreferrer">
                    Download Application Form
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
            <p className="Application-status-value">{application.paymentStatus}</p>
          </div>

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
              <p className="Application-status-label"> URU Investigator Checks  </p>
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
            <div className={`Application-status-step payment ${application.status === 'Paid' ? 'completed' : ''}`}>
              <div className="Application-status-circle blue" onClick={() => handlePayment(application.applicationNumber, application.price)}>
                <MdPayment className="Application-status-icon" />
              </div>
              <p className="Application-status-label">Make Payment</p>
            </div>
          </div>

          {application.status === 'Paid' && (
            <div className="payment-successful">
              <p>Thank you for your payment!</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ApplicationStatus;