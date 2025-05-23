import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageURU.css';
import { API_URL } from '../../Api';


const ManageURU = () => {
  const [uruData, setUruData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token'); // assuming you're storing the token in local storage

  useEffect(() => {
    getAllUru();
  }, []);

  const getAllUru = async () => {
    try {
      const response = await axios.get(`${API_URL}/uru/get-all-uru`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUruData(response.data);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllUru();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/uru/update-uru/${editingData._id}`, editingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllUru();
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

 const handleApprove = async (id) => {
    try {
      await axios.put(`${API_URL}/uru/approve-uru/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getAllUru();
    } catch (error) {
      console.error(error.response.data);
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


  return (
    <div className="manage-uru-container">
      <h1 className="manage-uru-heading">Manage URU</h1>
      <table className="uru-table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>User ID</th>
            <th>Application Number</th>
            <th>Position</th>
            <th>Applicant Name</th>
            <th>Sex</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>District</th>
            <th>Country</th>
            <th>State</th>
            <th>Pin Code</th>
            <th>Educational Qualification</th>
            <th>Whatsapp Mobile Number</th>
            <th>Email Id</th>
            <th>Occupation</th>
            <th>Record Category</th>
            <th>Record Title</th>
            <th>Record Description</th>
            <th>Purpose of Record Attempt</th>
            <th>Date of Attempt</th>
            <th>Record Venue</th>
            <th>Organisation Name</th>
            <th>Google Drive Link</th>
            <th>Facebook Link</th>
            <th>YouTube Link</th>
            <th>Instagram Link</th>
            <th>LinkedIn Link</th>
            <th>X Link</th>
            <th>Pinterest Link</th>
            <th>Other Media Link</th>
            <th>Photo Url</th>
            <th>Video Url</th>
            <th>Document Url</th>
            <th>Status</th>
            <th>Price</th>
            <th>Payment Status</th>
            <th>Razorpay Order ID</th>
            <th>Razorpay Payment ID</th>
            <th>Razorpay Signature</th>
            <th>Price Updated</th>
            <th>Price Updated Date</th>
            <th>Witness 1 Name</th>
            <th>Witness 1 Designation</th>
            <th>Witness 1 Address</th>
            <th>Witness 1 Mobile Number</th>
            <th>Witness 1 Email Id</th>
            <th>Witness 2 Name</th>
            <th>Witness 2 Designation</th>
            <th>Witness 2 Address</th>
            <th>Witness 2 Mobile Number</th>
            <th>Witness 2 Email Id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {uruData.map((data, index) => (
            <tr key={data._id}>
              <td>{index + 1}</td>
              <td>{data.userId}</td>
              <td>{data.applicationNumber}</td>
              <td>{data.position}</td>
              <td>{data.applicantName}</td>
              <td>{data.sex}</td>
              <td>{data.dateOfBirth}</td>
              <td>{data.address}</td>
              <td>{data.district}</td>
              <td>{data.country}</td>
              <td>{data.state}</td>
              <td>{data.pinCode}</td>
              <td>{data.educationalQualification}</td>
              <td>{data.whatsappMobileNumber}</td>
              <td>{data.emailId}</td>
              <td>{data.occupation}</td>
              <td>{data.recordCategory}</td>
              <td>{data.recordTitle}</td>
              <td>{data.recordDescription}</td>
              <td>{data.purposeOfRecordAttempt}</td>
              <td>{data.dateOfAttempt}</td>
              <td>{data.recordVenue}</td>
              <td>{data.organisationName}</td>
              <td><a href={data.googleDriveLink} target="_blank">Link</a></td>
              <td><a href={data.facebookLink} target="_blank">Link</a></td>
              <td><a href={data.youtubeLink} target="_blank">Link</a></td>
              <td><a href={data.instagramLink} target="_blank">Link</a></td>
              <td><a href={data.linkedInLink} target="_blank">Link</a></td>
              <td><a href={data.xLink} target="_blank">Link</a></td>
              <td><a href={data.pinterestLink} target="_blank">Link</a></td>
              <td><a href={data.otherMediaLink} target="_blank">Link</a></td>
              <td><a href={data.photoUrl} target="_blank">Link</a></td>
              <td><a href={data.videoUrl} target="_blank">Link</a></td>
              <td><a href={data.documentUrl} target="_blank">Link</a></td>
              <td>{data.status}</td>
              <td>{data.price}</td>
              <td>{data.paymentStatus}</td>
              <td>{data.razorpayOrderId}</td>
              <td>{data.razorpayPaymentId}</td>
              <td>{data.razorpaySignature}</td>
              <td>{data.priceUpdated ? 'Yes' : 'No'}</td>
              <td>{data.priceUpdatedDate}</td>
              <td>{data.witness1 && data.witness1.name ? data.witness1.name : '-'}</td>
              <td>{data.witness1 && data.witness1.designation ? data.witness1.designation : '-'}</td>
              <td>{data.witness1 && data.witness1.address ? data.witness1.address : '-'}</td>
              <td>{data.witness1 && data.witness1.mobileNumber ? data.witness1.mobileNumber : '-'}</td>
              <td>{data.witness1 && data.witness1.emailId ? data.witness1.emailId : '-'}</td>
              <td>{data.witness2 && data.witness2.name ? data.witness2.name : '-'}</td>
              <td>{data.witness2 && data.witness2.designation ? data.witness2.designation : '-'}</td>
              <td>{data.witness2 && data.witness2.address ? data.witness2.address : '-'}</td>
              <td>{data.witness2 && data.witness2.mobileNumber ? data.witness2.mobileNumber : '-'}</td>
              <td>{data.witness2 && data.witness2.emailId ? data.witness2.emailId : '-'}</td>
              <td className="manage-uru-actions">
                <button className="edit" onClick={() => handleEdit(data)}>Edit</button>
                <button className="delete" onClick={() => handleDelete(data._id)}>Delete</button>
                <button className="approve" onClick={() => handleApprove(data._id)}>Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>Edit Data</h2>
            <form onSubmit={handleUpdate}>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Application Number:</label>
                  <input type="text" name="applicationNumber" value={editingData.applicationNumber} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Applicant Name:</label>
                  <input type="text" name="applicantName" value={editingData.applicantName} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Sex:</label>
                  <input type="text" name="sex" value={editingData.sex} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Date of Birth:</label>
                  <input type="date" name="dateOfBirth" value={editingData.dateOfBirth} onChange={handleChange} />
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
                  <label>Record Category:</label>
                  <input type="text" name="recordCategory" value={editingData.recordCategory} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Record Title:</label>
                  <input type="text" name="recordTitle" value={editingData.recordTitle} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Record Description:</label>
                  <input type="text" name="recordDescription" value={editingData.recordDescription} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Purpose of Record Attempt:</label>
                  <input type="text" name="purposeOfRecordAttempt" value={editingData.purposeOfRecordAttempt} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Date of Attempt:</label>
                  <input type="date" name="dateOfAttempt" value={editingData.dateOfAttempt} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Record Venue:</label>
                  <input type="text" name="recordVenue" value={editingData.recordVenue} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Organisation Name:</label>
                  <input type="text" name="organisationName" value={editingData.organisationName} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Status:</label>
                  <input type="text" name="status" value={editingData.status} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Price:</label>
                  <input type="number" name="price" value={editingData.price} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Payment Status:</label>
                  <input type="text" name="paymentStatus" value={editingData.paymentStatus} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Razorpay Order ID:</label>
                  <input type="text" name="razorpayOrderId" value={editingData.razorpayOrderId} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Razorpay Payment ID:</label>
                  <input type="text" name="razorpayPaymentId" value={editingData.razorpayPaymentId} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Razorpay Signature:</label>
                  <input type="text" name="razorpaySignature" value={editingData.razorpaySignature} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                      <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Witness 1 Name:</label>
            <input type="text" name="witness1.name" value={editingData.witness1 && editingData.witness1.name ? editingData.witness1.name : ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 1 Designation:</label>
            <input type="text" name="witness1.designation" value={editingData.witness1 && editingData.witness1.designation ? editingData.witness1.designation : ''} onChange={handleChange} />
          </div>
          <div className="manage-uru-form-group">
            <label>Witness 1 Address:</label>
            <input type="text" name="witness1.address" value={editingData.witness1 && editingData.witness1.address ? editingData.witness1.address : ''} onChange={handleChange} />
          </div>
        </div>
              </div>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Witness 1 Mobile Number:</label>
                  <input type="text" name="witness1.mobileNumber" value={editingData.witness1.mobileNumber} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Witness 2 Name:</label>
                  <input type="text" name="witness2.name" value={editingData.witness2.name} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Witness 2 Designation:</label>
                  <input type="text" name="witness2.designation" value={editingData.witness2.designation} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                <div className="manage-uru-form-group">
                  <label>Witness 2 Address:</label>
                  <input type="text" name="witness2.address" value={editingData.witness2.address} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Witness 2 Mobile Number:</label>
                  <input type="text" name="witness2.mobileNumber" value={editingData.witness2.mobileNumber} onChange={handleChange} />
                </div>
                <div className="manage-uru-form-group">
                  <label>Witness 2 Email Id:</label>
                  <input type="email" name="witness2.emailId" value={editingData.witness2.emailId} onChange={handleChange} />
                </div>
              </div>
              <div className="manage-uru-form-row">
                <button type="submit" className='manage-uru-submit'>Update</button>
                <button type="button" className='manage-uru-button' onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageURU;