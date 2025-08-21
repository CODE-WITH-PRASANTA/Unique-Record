import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageURU.css';
import { API_URL } from '../../Api';

const ManageURU = () => {
  const [uruData, setUruData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    getAllUru();
  }, []);

  const getAllUru = async () => {
    try {
      const response = await axios.get(`${API_URL}/uru/get-all-uru`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Latest data first (reverse order)
      const reversed = response.data.reverse();
      setUruData(reversed);
      setFilteredData(reversed);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (data) => {
    setEditingData({
      ...data,
      witness1: data.witness1 || {},
      witness2: data.witness2 || {},
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/uru/delete-uru/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      getAllUru();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/uru/update-uru/${editingData._id}`,
        editingData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getAllUru();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(
        `${API_URL}/uru/approve-uru/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getAllUru();
    } catch (error) {
      console.error(error.response?.data || error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('witness1.')) {
      const witness1 = { ...editingData.witness1 };
      witness1[name.split('.')[1]] = value;
      setEditingData({ ...editingData, witness1 });
    } else if (name.startsWith('witness2.')) {
      const witness2 = { ...editingData.witness2 };
      witness2[name.split('.')[1]] = value;
      setEditingData({ ...editingData, witness2 });
    } else {
      setEditingData({ ...editingData, [name]: value });
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredData(uruData);
    } else {
      const term = searchTerm.toLowerCase();
      const results = uruData.filter(
        (item) =>
          item.applicantName?.toLowerCase().includes(term) ||
          item.applicationNumber?.toLowerCase().includes(term) ||
          item.emailId?.toLowerCase().includes(term) ||
          item.whatsappMobileNumber?.toLowerCase().includes(term)
      );
      setFilteredData(results);
    }
  };

  return (
    <div className="manage-uru-container">
      <h1 className="manage-uru-heading">Manage URU</h1>

      {/* Search Section */}
      <div className="manage-uru-search">
        <input
          type="text"
          placeholder="Search by Name, Application No, Email or Mobile..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="table-responsive">
        <table className="uru-table">
           <thead>
              <tr>
                <th>S.No.</th>
                <th>Application Number</th>
                <th>Position</th>
                <th>Applicant Name</th>
                <th>Sex</th>
                <th>Whatsapp Mobile Number</th>
                <th>Email Id</th>
                <th>Country</th>   {/* New */}
                <th>State</th>     {/* New */}
                <th>Actions</th>
              </tr>
            </thead>

        <tbody>
              {filteredData.map((data, index) => (
                <tr key={data._id}>
                  <td>{index + 1}</td>
                  <td>{data.applicationNumber}</td>
                  <td>{data.position}</td>
                  <td>{data.applicantName}</td>
                  <td>{data.sex}</td>
                  <td>{data.whatsappMobileNumber}</td>
                  <td>{data.emailId}</td>
                  <td>{data.country}</td>  {/* New */}
                  <td>{data.state}</td>    {/* New */}
                  <td className="manage-uru-actions">
                    <button className="edit" onClick={() => handleEdit(data)}>
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => handleDelete(data._id)}
                    >
                      Delete
                    </button>
                    {data.isApproved ? (
                      <button className="approved" disabled>
                        Approved
                      </button>
                    ) : (
                      <button
                        className="approve"
                        onClick={() => handleApprove(data._id)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>

        </table>
      </div>

      {showModal && (
        <div className="edit-modal show">
          <div className="edit-modal-content">
            <h2>Edit Data</h2>
            <form onSubmit={handleUpdate}>
              <h3>1. Applicant Details</h3>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>1.1 Application Number:</label>
                  <input type="text" name="applicationNumber" value={editingData.applicationNumber} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.2 Applicant Name:</label>
                  <input type="text" name="applicantName" value={editingData.applicantName} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.3 Sex:</label>
                  <input type="text" name="sex" value={editingData.sex} onChange={handleChange} />
                </div>
              </div>

              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>1.4 Date of Birth:</label>
                  <input type="date" name="dateOfBirth" value={editingData.dateOfBirth} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.5 Address:</label>
                  <input type="text" name="address" value={editingData.address} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.6 District:</label>
                  <input type="text" name="district" value={editingData.district} onChange={handleChange} />
                </div>
              </div>

              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>1.7 Country:</label>
                  <input type="text" name="country" value={editingData.country} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.8 State:</label>
                  <input type="text" name="state" value={editingData.state} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.9 Pin Code:</label>
                  <input type="text" name="pinCode" value={editingData.pinCode} onChange={handleChange} />
                </div>
              </div>

              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>1.10 Educational Qualification:</label>
                  <input type="text" name="educationalQualification" value={editingData.educationalQualification} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.11 Whatsapp Mobile Number:</label>
                  <input type="text" name="whatsappMobileNumber" value={editingData.whatsappMobileNumber} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>1.12 Email Id:</label>
                  <input type="email" name="emailId" value={editingData.emailId} onChange={handleChange} />
                </div>
              </div>

              <h3>2. Record Details</h3>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>2.1 Record Category:</label>
                  <input type="text" name="recordCategory" value={editingData.recordCategory} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>2.2 Record Title:</label>
                  <input type="text" name="recordTitle" value={editingData.recordTitle} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>2.3 Record Description:</label>
                  <input type="text" name="recordDescription" value={editingData.recordDescription} onChange={handleChange} />
                </div>
              </div>

              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>2.4 Purpose of Record Attempt:</label>
                  <input type="text" name="purposeOfRecordAttempt" value={editingData.purposeOfRecordAttempt} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>2.5 Date of Attempt:</label>
                  <input type="date" name="dateOfAttempt" value={editingData.dateOfAttempt} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>2.6 Record Venue:</label>
                  <input type="text" name="recordVenue" value={editingData.recordVenue} onChange={handleChange} />
                </div>
              </div>

              <h3>3. Payment Details</h3>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>3.1 Razorpay Order ID:</label>
                  <input type="text" name="razorpayOrderId" value={editingData.razorpayOrderId} onChange={handleChange} readOnly />
                </div>
                <div className="manage-uru-form-group">
                  <label>3.2 Razorpay Payment ID:</label>
                  <input type="text" name="razorpayPaymentId" value={editingData.razorpayPaymentId} onChange={handleChange} readOnly />
                </div>
                <div className="manage-uru-form-group">
                  <label>3.3 Razorpay Signature:</label>
                  <input type="text" name="razorpaySignature" value={editingData.razorpaySignature} onChange={handleChange} readOnly />
                </div>
              </div>

              <h3>4. Witness Details</h3>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>4.1 Witness 1 Name:</label>
                  <input type="text" name="witness1.name" value={editingData.witness1 && editingData.witness1.name ? editingData.witness1.name : ''} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>4.2 Witness 1 Designation:</label>
                  <input type="text" name="witness1.designation" value={editingData.witness1 && editingData.witness1.designation ? editingData.witness1.designation : ''} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>4.3 Witness 1 Address:</label>
                  <input type="text" name="witness1.address" value={editingData.witness1 && editingData.witness1.address ? editingData.witness1.address : ''} onChange={handleChange} />
                </div>
              </div>

              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>4.4 Witness 1 Mobile Number:</label>
                  <input type="text" name="witness1.mobileNumber" value={editingData.witness1 && editingData.witness1.mobileNumber ? editingData.witness1.mobileNumber : ''} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>4.5 Witness 2 Name:</label>
                  <input type="text" name="witness2.name" value={editingData.witness2 && editingData.witness2.name ? editingData.witness2.name : ''} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>4.6 Witness 2 Designation:</label>
                  <input type="text" name="witness2.designation" value={editingData.witness2 && editingData.witness2.designation ? editingData.witness2.designation : ''} onChange={handleChange} />
                </div>
              </div>

              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>4.7 Witness 2 Address:</label>
                  <input type="text" name="witness2.address" value={editingData.witness2 && editingData.witness2.address ? editingData.witness2.address : ''} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>4.8 Witness 2 Mobile Number:</label>
                  <input type="text" name="witness2.mobileNumber" value={editingData.witness2 && editingData.witness2.mobileNumber ? editingData.witness2.mobileNumber : ''} onChange={handleChange} />
                </div>
              </div>

              <div className="manage-uru-form-row" style={{ justifyContent: 'flex-end' }}>
                <button type="button" className="manage-uru-button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="manage-uru-submit">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageURU;