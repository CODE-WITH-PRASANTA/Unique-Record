import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import DeleteIcon from '@mui/icons-material/Delete';
import './AdminManageDonations.css';
import { API_URL } from '../../Api';
import Swal from "sweetalert2";

const AdminManageDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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


const handleDeleteDonation = async (donationId) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await axios.delete(`${API_URL}/donation/delete/${donationId}`);
        
        if (res.data.success) {
          // Remove from state
          setDonations(prev => prev.filter(d => d._id !== donationId));

          Swal.fire({
            title: "Deleted!",
            text: "Donation has been deleted successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          Swal.fire({
            title: "Failed!",
            text: "Could not delete donation.",
            icon: "error"
          });
        }
      } catch (error) {
        console.error("Error deleting donation:", error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting donation.",
          icon: "error"
        });
      }
    }
  });
};


  // Filter donations based on search
  const filteredDonations = donations.filter(donation =>
    (donation.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (donation.paymentNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (donation.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Search Input */}
      <div className="donation-search">
        <input
          type="text"
          placeholder="Search by Name, Payment Number, or Email..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="donation-table-wrapper">
        <table className="donation-table">
          <thead>
            <tr>
              <th>Sl. No.</th>
              <th>Payment Number</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Certificate</th>
              <th>Address</th>
              <th>Extra Info</th>
              <th>Date</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.map((donation, index) => (
              <tr key={donation._id}>
                <td>{index + 1}</td>
                <td>{donation.paymentNumber || 'N/A'}</td>
                <td>{donation.name}</td>
                <td>{donation.phone}</td>
                <td>{donation.email}</td>
                <td>₹{donation.amount}</td>
                <td>{donation.certificate}</td>
                <td>{donation.address}</td>
                <td>{donation.extra || 'N/A'}</td>
                <td>{new Date(donation.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteDonation(donation._id)}
                    title="Delete Donation"
                  >
                    <DeleteIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredDonations.length === 0 && (
          <p style={{ padding: '10px', textAlign: 'center' }}>No donations found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminManageDonations;
