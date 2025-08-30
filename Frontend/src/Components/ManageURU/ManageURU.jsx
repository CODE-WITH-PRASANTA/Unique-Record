import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageURU.css';
import { API_URL } from '../../Api';
import Swal from "sweetalert2";

const ManageURU = () => {
  const [uruData, setUruData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // New state for filter status

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
    photoUrls: data.photos || [],    // map backend → frontend
    videoUrls: data.videos || [],
    documentUrls: data.documents || [],
    googleDriveLinks: data.googleDriveLink ? [data.googleDriveLink] : [],
    youtubeLinks: data.youtubeLink ? [data.youtubeLink] : [],
    instagramLinks: data.instagramLink ? [data.instagramLink] : [],
    facebookLinks: data.facebookLink ? [data.facebookLink] : [],
    linkedInLinks: data.linkedInLink ? [data.linkedInLink] : [],
    xLinks: data.xLink ? [data.xLink] : [],
    pinterestLinks: data.pinterestLink ? [data.pinterestLink] : [],
    otherMediaLinks: data.otherMediaLink ? [data.otherMediaLink] : []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
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
          await axios.delete(`${API_URL}/uru/delete-uru/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          getAllUru(); 
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while deleting.",
            icon: "error",
          });
        }
      }
    });
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
      filterData(uruData);
    } else {
      const term = searchTerm.toLowerCase();
      const results = uruData.filter(
        (item) =>
          item.applicantName?.toLowerCase().includes(term) ||
          item.applicationNumber?.toLowerCase().includes(term) ||
          item.emailId?.toLowerCase().includes(term) ||
          item.whatsappMobileNumber?.toLowerCase().includes(term)
      );
      filterData(results);
    }
  };

  const filterData = (data) => {
    if (filterStatus === 'all') {
      setFilteredData(data);
    } else if (filterStatus === 'approved') {
      setFilteredData(data.filter(item => item.isApproved));
    } else if (filterStatus === 'notApproved') {
      setFilteredData(data.filter(item => !item.isApproved));
    }
  };
  
  useEffect(() => {
    handleSearch();
  }, [filterStatus]);


  
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
              <th>Country</th>   
              <th>State</th>     
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((data, index) => (
              <tr key={data._id}>
                <td>{filteredData.length - index}</td>
                <td>{data.applicationNumber}</td>
                <td>{data.position}</td>
                <td>{data.applicantName}</td>
                <td>{data.sex}</td>
                <td>{data.whatsappMobileNumber}</td>
                <td>{data.emailId}</td>
                <td>{data.country}</td>  
                <td>{data.state}</td>    
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
                  {data.status === "Approved" ? (
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
            <input type="text" name="applicantName" value={editingData.applicantName} onChange={handleChange} readOnly={!!editingData.applicantName} />
          </div>
          {/* Sex */}
          <div className="manage-uru-form-group">
            <label>Sex:</label>
            <select
              name="sex"
              value={editingData.sex ? editingData.sex.toLowerCase() : ""}
              onChange={(e) =>
                setEditingData({ ...editingData, sex: e.target.value })
              }
              className="manage-uru-select"
            >
              <option value="">-- Select Sex --</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="transgender">Transgender</option>
            </select>
          </div>

        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Date of Birth:</label>
            <input type="date" name="dateOfBirth" value={editingData.dateOfBirth ? editingData.dateOfBirth.slice(0,10) : ''} onChange={handleChange} />
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
            <select name="formCategory" value={editingData.formCategory} onChange={handleChange} className="form-category-select">
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
              value={editingData.recordCategory?.toLowerCase() || ""}
              onChange={(e) =>
                setEditingData({ ...editingData, recordCategory: e.target.value.toLowerCase() })
              }
            >
              <option value="">-- Select Effort Type --</option>
              <option value="individual">Individual Effort</option>
              <option value="group">Group Effort</option>
            </select>

          </div>

          <div className="manage-uru-form-group">
            <label>Record Title:</label>
            <textarea name="recordTitle" value={editingData.recordTitle} onChange={handleChange} className="large-textarea" />
          </div>
          <div className="manage-uru-form-group">
            <label>Record Description:</label>
            <textarea name="recordDescription" value={editingData.recordDescription} onChange={handleChange} className="large-textarea" />
          </div>
        </div>

        <div className="manage-uru-form-row">
          <div className="manage-uru-form-group">
            <label>Purpose of Record Attempt:</label>
            <textarea name="purposeOfRecordAttempt" value={editingData.purposeOfRecordAttempt} onChange={handleChange} />
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
        </div>

          <h3>Social Media Links</h3>
          <div className="manage-uru-form-row">
            {/* Google Drive */}
            <div className="manage-uru-form-group">
              <label>Google Drive Links:</label>
              <ul>
                {editingData.googleDriveLink?.length > 0 ? (
                  editingData.googleDriveLink.map((link, index) => (
                    <li key={`gdrive-${index}`}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                  ))
                ) : (
                  <p>No Google Drive links</p>
                )}
              </ul>
            </div>

            {/* YouTube */}
            <div className="manage-uru-form-group">
              <label>YouTube Links:</label>
              <ul>
                {editingData.youtubeLink?.length > 0 ? (
                  editingData.youtubeLink.map((link, index) => (
                    <li key={`yt-${index}`}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                  ))
                ) : (
                  <p>No YouTube links</p>
                )}
              </ul>
            </div>

            {/* Instagram */}
            <div className="manage-uru-form-group">
              <label>Instagram Links:</label>
              <ul>
                {editingData.instagramLink?.length > 0 ? (
                  editingData.instagramLink.map((link, index) => (
                    <li key={`ig-${index}`}>
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                    </li>
                  ))
                ) : (
                  <p>No Instagram links</p>
                )}
              </ul>
            </div>
          </div>
          <div className='manage-uru-form-row'>
          {/* Facebook */}
          <div className="manage-uru-form-group">
            <label>Facebook Links:</label>
            <ul>
              {editingData.facebookLink?.length > 0 ? (
                editingData.facebookLink.map((link, index) => (
                  <li key={`fb-${index}`}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))
              ) : (
                <p>No Facebook links</p>
              )}
            </ul>
          </div>

          {/* LinkedIn */}
          <div className="manage-uru-form-group">
            <label>LinkedIn Links:</label>
            <ul>
              {editingData.linkedInLink?.length > 0 ? (
                editingData.linkedInLink.map((link, index) => (
                  <li key={`li-${index}`}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))
              ) : (
                <p>No LinkedIn links</p>
              )}
            </ul>
          </div>

          {/* X (Twitter) */}
          <div className="manage-uru-form-group">
            <label>X (Twitter) Links:</label>
            <ul>
              {editingData.xLink?.length > 0 ? (
                editingData.xLink.map((link, index) => (
                  <li key={`x-${index}`}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))
              ) : (
                <p>No X links</p>
              )}
            </ul>
          </div>

          {/* Pinterest */}
          <div className="manage-uru-form-group">
            <label>Pinterest Links:</label>
            <ul>
              {editingData.pinterestLink?.length > 0 ? (
                editingData.pinterestLink.map((link, index) => (
                  <li key={`pin-${index}`}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))
              ) : (
                <p>No Pinterest links</p>
              )}
            </ul>
          </div>

          {/* Other Media */}
          <div className="manage-uru-form-group">
            <label>Other Media Links:</label>
            <ul>
              {editingData.otherMediaLink?.length > 0 ? (
                editingData.otherMediaLink.map((link, index) => (
                  <li key={`other-${index}`}>
                    <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                  </li>
                ))
              ) : (
                <p>No Other Media links</p>
              )}
            </ul>
          </div>

          </div>

        {/* 3. Media & Documents */}
        <h3>3. Media & Documents</h3>
        <div className="manage-uru-form-row">
         <div className="manage-uru-form-group">
          <label>Photos:</label>
          <div className="media-preview">
            {editingData.photoUrls?.length > 0 ? (
              editingData.photoUrls.map((url, index) => (
                <a
                  key={`photo-${index}`}
                  href={url}
                  download={`photo-${index + 1}.jpg`} // forces download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={url}
                    alt={`photo-${index}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                      marginRight: "8px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  />
                </a>
              ))
            ) : (
              <p>No photos uploaded</p>
            )}
          </div>
        </div>


          <div className="manage-uru-form-group">
            <label>Videos:</label>
            <div className="media-preview">
              {editingData.videoUrls?.length > 0 ? (
                editingData.videoUrls.map((url, index) => (
                  <video key={`video-${index}`} src={url} controls style={{ width: "120px", height: "80px", marginRight: "8px", borderRadius: "6px" }} />
                ))
              ) : (
                <p>No videos uploaded</p>
              )}
            </div>
          </div>

        <div className="manage-uru-form-group">
            <label>Documents:</label>
            <ul>
              {editingData.documents?.length > 0 ? (
                editingData.documents.map((doc, index) => {
                  // Generate download link using public_id
                  const downloadUrl = `https://res.cloudinary.com/dorcgl1jg/raw/upload/fl_attachment/${doc.public_id}`;

                  return (
                    <li key={`doc-${index}`}>
                      {/* View option */}
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: "10px" }}>
                        View Document {index + 1}
                      </a>
                      {/* Download option */}
                      <a href={downloadUrl}>
                        ⬇️ Download
                      </a>
                    </li>
                  );
                })
              ) : (
                <p>No documents uploaded</p>
              )}
            </ul>
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
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn-update"
          >
            Update
          </button>
        </div>

      </form>
    </div>
  </div>
    )}

    </div>
  );
};

export default ManageURU;