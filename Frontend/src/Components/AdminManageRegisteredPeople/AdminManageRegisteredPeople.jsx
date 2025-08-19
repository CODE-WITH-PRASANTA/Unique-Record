import React, { useState, useEffect } from "react";
import { FaBell, FaDownload } from "react-icons/fa";
import axios from "axios";
import "./AdminManageRegisteredPeople.css";
import { API_URL } from '../../Api';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


const AdminManageRegisteredPeople = () => {
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [eventNames, setEventNames] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(`${API_URL}/registerevent/registrations`);
        setApplicants(response.data.data);
        setFilteredApplicants(response.data.data);

        // Event count logic
        const eventCountMap = {};
        response.data.data.forEach(applicant => {
          if (!eventCountMap[applicant.eventName]) {
            eventCountMap[applicant.eventName] = 1;
          } else {
            eventCountMap[applicant.eventName]++;
          }
        });

        const eventList = Object.keys(eventCountMap).map(event => ({
          name: event,
          count: eventCountMap[event],
        }));

        setEventNames(eventList);
      } catch (err) {
        setError("Failed to load registrations");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  useEffect(() => {
    const filteredApplicants = applicants.filter(applicant => {
      if (selectedEvent && applicant.eventName !== selectedEvent) return false;
      if (searchTerm && !applicant.applicantName.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });
    setFilteredApplicants(filteredApplicants);
  }, [selectedEvent, searchTerm, applicants]);

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

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error-message">{error}</p>;


  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredApplicants.map((applicant, index) => ({
      "S.No": index + 1,
      "Event Name": applicant.eventName,
      "Applicant Name": applicant.applicantName,
      "Sex": applicant.sex,
      "DOB": new Date(applicant.dateOfBirth).toLocaleDateString(),
      "Phone": applicant.phone,
      "Pincode": applicant.pinCode,
      "District": applicant.district,
      "State": applicant.state,
      "Email": applicant.email,
      "Website": applicant.website || "N/A",
      "Education": applicant.education,
      "Skills": applicant.skills,
      "Order ID": applicant.orderId,
      "Payment ID": applicant.paymentId,
      "Amount": `${applicant.amount} ${applicant.currency}`,
      "Method": applicant.method,
      "Status": applicant.status,
      "Date": new Date(applicant.date).toLocaleDateString(),
    })));
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Applicants");
  
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Registered_Applicants.xlsx");
  };
  

  return (
    <div className="AdminManage-Registered-People-container">
      <h2 className="AdminManage-Registered-People-title">Registered Applicants</h2>

      <div className="AdminManage-Registered-People-filter-container">
        <select value={selectedEvent} onChange={handleEventChange}>
          <option value="">All Events</option>
          {eventNames.map(({ name, count }) => (
            <option key={name} value={name}>
              {name} ({count})
            </option>
          ))}
        </select>
        <input type="search" value={searchTerm} onChange={handleSearchChange} placeholder="Search by Applicant Name" />
        <div className="AdminManage-Registered-People-download-container">
  <button onClick={downloadExcel} className="AdminManage-Registered-People-download-btn">
    Download Filtered Data (Excel)
  </button>
</div>

      </div>

      <div className="AdminManage-Registered-People-table-container">
        <table className="AdminManage-Registered-People-table">
          <thead className="admin-manage-th">
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
            {filteredApplicants.map((applicant, index) => (
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