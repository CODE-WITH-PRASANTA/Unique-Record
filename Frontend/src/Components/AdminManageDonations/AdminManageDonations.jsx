import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import './AdminManageDonations.css';
import { API_URL } from '../../Api';


const AdminManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get(`${API_URL}/donation/all`);
        if (response.data.success) {
          setDonations(response.data.donations);
        } else {
          console.error('Failed to fetch donations.');
        }
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchDonations();
  }, []);
  
  const handleSendMail = async (donationId, email) => {
    try {
      const res = await axios.post(`${API_URL}/donation/send-mail/${donationId}`);
      if (res.data.success) {
        alert(`📧 Mail sent successfully to: ${email}`);
      } else {
        alert(`❌ Failed to send mail to: ${email}`);
      }
    } catch (error) {
      console.error("Error sending mail:", error);
      alert(`❌ Error occurred while sending mail to: ${email}`);
    }
  };
  

  return (
    <div className="admin-donations-container">
      <div className="donation-header">
        <h2>Manage Donations</h2>
        <div className="notification">
          <NotificationsActiveIcon className="notification-icon" />
          <span>
            {loading ? 'Loading donations...' : `${donations.length} donations received`}
          </span>
        </div>
      </div>

      <div className="donation-table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Certificate</th>
              <th>Address</th>
              <th>Extra Info</th>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Signature</th>
              <th>Date</th>
              <th>Send Mail</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation, index) => (
              <tr key={donation._id}>
                <td>{index + 1}</td>
                <td>{donation.name}</td>
                <td>{donation.phone}</td>
                <td>{donation.email}</td>
                <td>₹{donation.amount}</td>
                <td>{donation.certificate}</td>
                <td>{donation.address}</td>
                <td>{donation.extra || 'N/A'}</td>
                <td>{donation.paymentId || 'N/A'}</td>
                <td>{donation.orderId || 'N/A'}</td>
                <td>{donation.signature || 'N/A'}</td>
                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                <td>
                <button
  className="mail-btn"
  onClick={() => handleSendMail(donation._id, donation.email)}
  title="Send Email"
>
  <MailOutlineIcon />
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && donations.length === 0 && (
          <p style={{ padding: '10px', textAlign: 'center' }}>No donations found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminManageDonations;
