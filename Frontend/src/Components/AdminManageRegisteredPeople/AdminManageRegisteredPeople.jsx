import React, { useState, useEffect } from "react";
import { FaBell, FaDownload } from "react-icons/fa";
import axios from "axios";
import "./AdminManageRegisteredPeople.css";
import { API_URL } from '../../Api';


const AdminManageRegisteredPeople = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(`${API_URL}/registerevent/registrations`);
        setApplicants(response.data.data);
      } catch (err) {
        setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };
  
    fetchRegistrations();
  }, []);
  
  const sendNotification = async (applicant) => {
    try {
      const response = await axios.post(`${API_URL}/registerevent/registrations/${applicant._id}/send-email`);
  
      if (response.status === 200) {
        setNotifications((prev) => [
          ...prev,
          `Email sent successfully to ${applicant.applicantName} for ${applicant.eventName}`,
        ]);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setNotifications((prev) => [
        ...prev,
        `Failed to send email to ${applicant.applicantName}`,
      ]);
    }
  };
  
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="AdminManage-Registered-People-container">
      <h2 className="AdminManage-Registered-People-title">Registered Applicants</h2>

      <div className="AdminManage-Registered-People-table-container">
        <table className="AdminManage-Registered-People-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Event Name</th>
              <th>Applicant Name</th>
              <th>Sex</th>
              <th>DOB</th>
              <th>Phone</th>
              <th>Pincode</th>
              <th>District</th>
              <th>State</th>
              <th>Email</th>
              <th>Website</th>
              <th>Education</th>
              <th>Skill</th>
              <th>BioData</th>
              <th>Passport</th>
              <th>Order ID</th>
              <th>Payment ID</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Date</th>
              <th>Notification</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant, index) => (
              <tr key={index} className="AdminManage-Registered-People-row">
                <td>{index + 1}</td>
                <td>{applicant.eventName}</td>
                <td>{applicant.applicantName}</td>
                <td>{applicant.sex}</td>
                <td>{new Date(applicant.dateOfBirth).toLocaleDateString()}</td>
                <td>{applicant.phone}</td>
                <td>{applicant.pinCode}</td>
                <td>{applicant.district}</td>
                <td>{applicant.state}</td>
                <td>{applicant.email}</td>
                <td>
                  {applicant.website ? (
                    <a href={applicant.website} target="_blank" rel="noreferrer">
                      {applicant.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{applicant.education}</td>
                <td>{applicant.skills}</td>
                <td>
                  <a href={applicant.bioDataUrl} download>
                    <FaDownload className="download-icon" />
                  </a>
                </td>
                <td>
                  <a href={applicant.passportPhotoUrl} download>
                    <FaDownload className="download-icon" />
                  </a>
                </td>
                <td>{applicant.orderId}</td>
                <td>{applicant.paymentId}</td>
                <td>{applicant.amount} {applicant.currency}</td>
                <td>{applicant.method}</td>
                <td className={applicant.status === "Paid" ? "paid" : "pending"}>
                  {applicant.status}
                </td>
                <td>{new Date(applicant.date).toLocaleDateString()}</td>
                <td>
                <button
                    className="AdminManage-Registered-People-notification-btn"
                    onClick={() => sendNotification(applicant)}
                >
                    <FaBell />
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notification Section */}
      <div className="AdminManage-Registered-People-notifications">
        <h3>Notification Log</h3>
        <ul>
          {notifications.map((note, index) => (
            <li key={index} className="AdminManage-Registered-People-notification-item">{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminManageRegisteredPeople;
