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
const [categories, setCategories] = useState([]);
  const [allData, setAllData] = useState([]); // ✅ now you can use setAllData


  const token = localStorage.getItem('token');

   const fetchCategories = async () => {
  try {
    const res = await fetch(`${API_URL}/categories`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    const sortedCategories = data.sort((a, b) => a.name.localeCompare(b.name));
    setCategories(sortedCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

useEffect(() => {
  getAllUru();
  fetchCategories();
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

    // Update state immediately so UI toggles without waiting for getAllUru()
    setUruData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, isApproved: true } : item
      )
    );

    setFilteredData((prevData) =>
      prevData.map((item) =>
        item._id === id ? { ...item, isApproved: true } : item
      )
    );
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
      <h2>Edit URU Data</h2>
      <form onSubmit={handleUpdate}>

        {/* 1. Applicant Details */}
        <h3>1. Applicant Details</h3>
        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Application Number:</label>
            <input type="text" name="applicationNumber" value={editingData.applicationNumber} onChange={handleChange} readOnly={!!editingData.applicationNumber} />
          </div>
          <div className="manage-uru-form-group">
            <label>Applicant Name:</label>
            <input type="text" name="applicantName" value={editingData.applicantName} onChange={handleChange} readOnly={!!editingData.applicantName}  />
          </div>
          <div className="manage-uru-form-group">
            <label>Sex:</label>
            <input type="text" name="sex" value={editingData.sex} onChange={handleChange} readOnly={!!editingData.sex}  />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Date of Birth:</label>
            <input type="date" name="dateOfBirth" value={editingData.dateOfBirth ? editingData.dateOfBirth.slice(0,10) : ''} onChange={handleChange} readOnly={!!editingData.dateOfBirth}  />
          </div>
          <div className="manage-uru-form-group">
            <label>Address:</label>
            <input type="text" name="address" value={editingData.address} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>District:</label>
            <input type="text" name="district" value={editingData.district} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Country:</label>
            <input type="text" name="country" value={editingData.country} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>State:</label>
            <input type="text" name="state" value={editingData.state} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Pin Code:</label>
            <input type="text" name="pinCode" value={editingData.pinCode} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Educational Qualification:</label>
            <input type="text" name="educationalQualification" value={editingData.educationalQualification} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Whatsapp Mobile Number:</label>
            <input type="text" name="whatsappMobileNumber" value={editingData.whatsappMobileNumber} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Email Id:</label>
            <input type="email" name="emailId" value={editingData.emailId} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Occupation:</label>
            <input type="text" name="occupation" value={editingData.occupation} onChange={handleChange} />
          </div>
         <div className="manage-uru-form-group">
            <label>Form Category:</label>
            <select
              name="formCategory"
              value={editingData.formCategory}
              onChange={handleChange}
              className="form-category-select"
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>


          <div className="manage-uru-form-group">
            <label>Price:</label>
            <input type="number" name="price" value={editingData.price} onChange={handleChange} readOnly />
          </div>
        </div>

        {/* 2. Record Details */}
        <h3>2. Record Details</h3>
        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Effort Type:</label>
            <select
              name="recordCategory"
              value={editingData.recordCategory}
              onChange={handleChange}
            >
              <option value="">-- Select Effort Type --</option>
              <option value="Individual Effort">Individual Effort</option>
              <option value="Group Effort">Group Effort</option>
            </select>
          </div>

         <div className="manage-uru-form-group">
            <label>Record Title:</label>
            <textarea
              type="text"
              name="recordTitle"
              value={editingData.recordTitle}
              onChange={handleChange}
              className="large-textarea"
            />
          </div>

          <div className="manage-uru-form-group">
            <label>Record Description:</label>
            <textarea
              name="recordDescription"
              value={editingData.recordDescription}
              onChange={handleChange}
              className="large-textarea"
            />
          </div>

        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Purpose of Record Attempt:</label>
            <input type="text" name="purposeOfRecordAttempt" value={editingData.purposeOfRecordAttempt} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Date of Attempt:</label>
            <input type="date" name="dateOfAttempt" value={editingData.dateOfAttempt ? editingData.dateOfAttempt.slice(0,10) : ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Record Venue:</label>
            <input type="text" name="recordVenue" value={editingData.recordVenue} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Organisation Name:</label>
            <input type="text" name="organisationName" value={editingData.organisationName} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Google Drive Link:</label>
            <input type="text" name="googleDriveLink" value={editingData.googleDriveLink} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Facebook Link:</label>
            <input type="text" name="facebookLink" value={editingData.facebookLink} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Youtube Link:</label>
            <input type="text" name="youtubeLink" value={editingData.youtubeLink} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Instagram Link:</label>
            <input type="text" name="instagramLink" value={editingData.instagramLink} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>LinkedIn Link:</label>
            <input type="text" name="linkedInLink" value={editingData.linkedInLink} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>X Link:</label>
            <input type="text" name="xLink" value={editingData.xLink} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Pinterest Link:</label>
            <input type="text" name="pinterestLink" value={editingData.pinterestLink} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Other Media Link:</label>
            <input type="text" name="otherMediaLink" value={editingData.otherMediaLink} onChange={handleChange} />
          </div>
        </div>

        {/* 3. Media Uploads */}
        <h3>3. Media & Documents</h3>
        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Photo URL:</label>
            <input type="text" name="photoUrl" value={editingData.photoUrl} onChange={handleChange} readOnly />
          </div>
          <div className="manage-uru-form-group">
            <label>Video URL:</label>
            <input type="text" name="videoUrl" value={editingData.videoUrl} onChange={handleChange} readOnly />
          </div>
          <div className="manage-uru-form-group">
            <label>Document URL:</label>
            <input type="text" name="documentUrl" value={editingData.documentUrl} onChange={handleChange} readOnly />
          </div>
        </div>

        {/* 4. Payment Details */}
        <h3>4. Payment Details</h3>
        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Razorpay Order ID:</label>
            <input type="text" name="razorpayOrderId" value={editingData.razorpayOrderId} readOnly />
          </div>
          <div className="manage-uru-form-group">
            <label>Razorpay Payment ID:</label>
            <input type="text" name="razorpayPaymentId" value={editingData.razorpayPaymentId} readOnly />
          </div>
          <div className="manage-uru-form-group">
            <label>Razorpay Signature:</label>
            <input type="text" name="razorpaySignature" value={editingData.razorpaySignature} readOnly />
          </div>
        </div>

        {/* 5. Witness Details */}
        <h3>5. Witness Details</h3>
        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Witness 1 Name:</label>
            <input type="text" name="witness1.name" value={editingData.witness1?.name || ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 1 Designation:</label>
            <input type="text" name="witness1.designation" value={editingData.witness1?.designation || ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 1 Address:</label>
            <input type="text" name="witness1.address" value={editingData.witness1?.address || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Witness 1 Mobile Number:</label>
            <input type="text" name="witness1.mobileNumber" value={editingData.witness1?.mobileNumber || ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 1 Email:</label>
            <input type="email" name="witness1.emailId" value={editingData.witness1?.emailId || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Witness 2 Name:</label>
            <input type="text" name="witness2.name" value={editingData.witness2?.name || ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 2 Designation:</label>
            <input type="text" name="witness2.designation" value={editingData.witness2?.designation || ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 2 Address:</label>
            <input type="text" name="witness2.address" value={editingData.witness2?.address || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Witness 2 Mobile Number:</label>
            <input type="text" name="witness2.mobileNumber" value={editingData.witness2?.mobileNumber || ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 2 Email:</label>
            <input type="email" name="witness2.emailId" value={editingData.witness2?.emailId || ''} onChange={handleChange} />
          </div>
        </div>
        {/* Buttons */}
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