import React, { useState, useEffect } from 'react';
import { FaImage, FaVideo, FaFilePdf, FaExternalLinkAlt, FaCertificate } from 'react-icons/fa';
import API from '../../api/axiosInstance';
import './ManageUru.css';

const ManageUru = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('applicant');
  const [editingRecord, setEditingRecord] = useState(null);

  // Fetch real records from backend
  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get('/uru/all');
      if (res.data && Array.isArray(res.data.data)) {
        setRecords(res.data.data);
      } else if (Array.isArray(res.data)) {
        setRecords(res.data);
      } else {
        setRecords([]);
      }
    } catch (error) {
      console.error('Error fetching URU records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Filter records based on search query
  const filteredRecords = records.filter((item) => {
    const term = searchTerm.toLowerCase();
    const name = (item.name || item.applicantName || '').toLowerCase();
    const appNo = (item.appNo || item.applicationNumber || '').toLowerCase();
    const email = (item.email || item.emailId || '').toLowerCase();
    const mobile = (item.mobile || item.whatsappMobileNumber || '').toString();
    const position = (item.position || '').toLowerCase();

    return (
      name.includes(term) ||
      appNo.includes(term) ||
      email.includes(term) ||
      mobile.includes(term) ||
      position.includes(term)
    );
  });

  // Fully Working Excel Download Functionality (CSV format compatible with Excel)
  const handleDownloadExcel = () => {
    if (records.length === 0) {
      alert('No data available to download.');
      return;
    }

    const headers = [
      'S.No.',
      'Application Number',
      'Position',
      'Applicant Name',
      'Sex',
      'Whatsapp Mobile Number',
      'Email Id',
      'Country',
      'State',
      'Status',
    ];

    const rows = filteredRecords.map((item, index) => [
      index + 1,
      item.appNo || item.applicationNumber,
      `"${item.position || 'Unique Record'}"`,
      `"${item.name || item.applicantName || ''}"`,
      item.sex || 'Other',
      item.mobile || item.whatsappMobileNumber || '',
      item.email || item.emailId || '',
      `"${item.country || 'India'}"`,
      `"${item.state || ''}"`,
      item.approved ? 'Approved' : 'Pending',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Manage_URU_Records_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to format date for input field
  const [modalLoading, setModalLoading] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);

  // Helper to format date for input field safely
  const formatDateForInput = (d) => {
    if (!d) return '';
    try {
      const dateObj = new Date(d);
      if (isNaN(dateObj.getTime())) return '';
      return dateObj.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  // Helper to map record into editingRecord form state
  const mapRecordToForm = (record) => {
    if (!record) return null;
    return {
      ...record,
      id: record.id || record._id,
      _id: record._id || record.id,
      appNo: record.appNo || record.applicationNumber || '',
      applicationNumber: record.appNo || record.applicationNumber || '',
      position: record.position || 'Unique Record',
      applicantName: record.applicantName || record.name || '',
      name: record.applicantName || record.name || '',
      sex: record.sex || 'Other',
      dateOfBirth: formatDateForInput(record.dateOfBirth),
      address: record.address || '',
      district: record.district || '',
      state: record.state || '',
      country: record.country || 'India',
      pinCode: record.pinCode || '',
      educationalQualification: record.educationalQualification || '',
      whatsappMobileNumber: record.whatsappMobileNumber || record.mobile || record.phoneNumber || '',
      mobile: record.whatsappMobileNumber || record.mobile || record.phoneNumber || '',
      emailId: record.emailId || record.email || '',
      email: record.emailId || record.email || '',
      occupation: record.occupation || '',
      category: record.category || record.formCategory || record.recordCategory || 'Other',
      effortType: record.effortType || 'Individual Effort',
      recordTitle: record.recordTitle || record.activityTitle || '',
      activityTitle: record.recordTitle || record.activityTitle || '',
      recordDescription: record.recordDescription || record.activityDescription || '',
      activityDescription: record.recordDescription || record.activityDescription || '',
      purposeOfRecordAttempt: record.purposeOfRecordAttempt || record.activityPurpose || '',
      activityPurpose: record.purposeOfRecordAttempt || record.activityPurpose || '',
      dateOfAttempt: formatDateForInput(record.dateOfAttempt || record.attemptDate),
      attemptDate: formatDateForInput(record.dateOfAttempt || record.attemptDate),
      recordVenue: record.recordVenue || record.activityVenue || '',
      activityVenue: record.recordVenue || record.activityVenue || '',
      organisationName: record.organisationName || '',
      // Links
      googleDriveLink: Array.isArray(record.googleDriveLink) ? record.googleDriveLink.join(', ') : record.googleDriveLink || '',
      facebookLink: Array.isArray(record.facebookLink) ? record.facebookLink.join(', ') : record.facebookLink || '',
      youtubeLink: Array.isArray(record.youtubeLink) ? record.youtubeLink.join(', ') : record.youtubeLink || '',
      instagramLink: Array.isArray(record.instagramLink) ? record.instagramLink.join(', ') : record.instagramLink || '',
      linkedInLink: Array.isArray(record.linkedInLink) ? record.linkedInLink.join(', ') : record.linkedInLink || '',
      twitterLink: Array.isArray(record.twitterLink) ? record.twitterLink.join(', ') : record.twitterLink || record.xLink || '',
      pinterestLink: Array.isArray(record.pinterestLink) ? record.pinterestLink.join(', ') : record.pinterestLink || '',
      otherMediaLink: Array.isArray(record.otherMediaLink) ? record.otherMediaLink.join(', ') : record.otherMediaLink || '',
      // Witnesses
      witness1: {
        name: record.witness1?.name || '',
        designation: record.witness1?.designation || '',
        address: record.witness1?.address || '',
        mobileNumber: record.witness1?.mobileNumber || '',
        emailId: record.witness1?.emailId || '',
      },
      witness2: {
        name: record.witness2?.name || '',
        designation: record.witness2?.designation || '',
        address: record.witness2?.address || '',
        mobileNumber: record.witness2?.mobileNumber || '',
        emailId: record.witness2?.emailId || '',
      },
      // Uploaded Evidence Files
      photos: Array.isArray(record.photos) ? record.photos : [],
      videos: Array.isArray(record.videos) ? record.videos : [],
      documents: Array.isArray(record.documents) ? record.documents : [],
      certificateUrl: record.certificateUrl || '',
      // Status & Payment
      status: record.status || (record.approved ? 'Approved' : 'Pending'),
      approved: Boolean(record.approved || record.status === 'Approved'),
      price: record.price !== undefined ? record.price : 0,
      paymentStatus: record.paymentStatus || 'Pending',
    };
  };

  // Open Edit Modal & Fetch ALL application fields from Database
  const handleEditClick = async (record) => {
    const targetId = record.id || record._id;
    // Immediately open modal pre-populated with row record
    setEditingRecord(mapRecordToForm(record));
    setActiveTab('applicant');
    setIsModalOpen(true);
    setModalLoading(true);

    try {
      // Fetch complete fresh data from database
      const res = await API.get(`/uru/${targetId}`);
      const freshData = res.data?.data || res.data?.uru || res.data;
      if (freshData) {
        setEditingRecord(mapRecordToForm(freshData));
      }
    } catch (err) {
      console.warn('Could not fetch fresh record details from database, using row data:', err);
    } finally {
      setModalLoading(false);
    }
  };

  // Save Edited Record from Modal Form to Database
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;
    try {
      setSavingEdit(true);
      const targetId = editingRecord.id || editingRecord._id;

      const parseLinkField = (val) => {
        if (!val) return [];
        if (Array.isArray(val)) return val.filter(Boolean);
        return String(val)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      };

      // Prepare complete payload with aliases mapped
      const payload = {
        ...editingRecord,
        applicantName: editingRecord.name || editingRecord.applicantName,
        name: editingRecord.name || editingRecord.applicantName,
        emailId: editingRecord.email || editingRecord.emailId,
        email: editingRecord.email || editingRecord.emailId,
        whatsappMobileNumber: editingRecord.mobile || editingRecord.whatsappMobileNumber,
        mobile: editingRecord.mobile || editingRecord.whatsappMobileNumber,
        recordTitle: editingRecord.activityTitle || editingRecord.recordTitle,
        activityTitle: editingRecord.activityTitle || editingRecord.recordTitle,
        recordDescription: editingRecord.activityDescription || editingRecord.recordDescription,
        activityDescription: editingRecord.activityDescription || editingRecord.recordDescription,
        purposeOfRecordAttempt: editingRecord.activityPurpose || editingRecord.purposeOfRecordAttempt,
        activityPurpose: editingRecord.activityPurpose || editingRecord.purposeOfRecordAttempt,
        recordVenue: editingRecord.activityVenue || editingRecord.recordVenue,
        activityVenue: editingRecord.activityVenue || editingRecord.recordVenue,
        dateOfAttempt: editingRecord.dateOfAttempt,
        attemptDate: editingRecord.dateOfAttempt,
        dateOfBirth: editingRecord.dateOfBirth,
        address: editingRecord.address,
        district: editingRecord.district,
        state: editingRecord.state,
        country: editingRecord.country,
        pinCode: editingRecord.pinCode,
        occupation: editingRecord.occupation,
        educationalQualification: editingRecord.educationalQualification,
        category: editingRecord.category,
        formCategory: editingRecord.category,
        recordCategory: editingRecord.category,
        effortType: editingRecord.effortType,
        position: editingRecord.position,
        organisationName: editingRecord.organisationName,
        price: Number(editingRecord.price) || 0,
        paymentStatus: editingRecord.paymentStatus,
        status: editingRecord.status,
        approved: editingRecord.status === 'Approved',
        witness1: editingRecord.witness1,
        witness2: editingRecord.witness2,
        googleDriveLink: parseLinkField(editingRecord.googleDriveLink),
        facebookLink: parseLinkField(editingRecord.facebookLink),
        youtubeLink: parseLinkField(editingRecord.youtubeLink),
        instagramLink: parseLinkField(editingRecord.instagramLink),
        linkedInLink: parseLinkField(editingRecord.linkedInLink),
        twitterLink: parseLinkField(editingRecord.twitterLink),
        pinterestLink: parseLinkField(editingRecord.pinterestLink),
        otherMediaLink: parseLinkField(editingRecord.otherMediaLink),
      };

      const res = await API.put(`/uru/${targetId}`, payload);
      const updated = res.data?.data || payload;

      setRecords((prev) =>
        prev.map((rec) =>
          (rec.id || rec._id) === targetId
            ? { ...rec, ...updated, approved: payload.status === 'Approved' }
            : rec
        )
      );
      setIsModalOpen(false);
      setEditingRecord(null);
      alert('Application record updated in database successfully!');
    } catch (err) {
      console.error('Failed to update record in database:', err);
      alert(err.response?.data?.message || 'Failed to update application record. Please try again.');
    } finally {
      setSavingEdit(false);
    }
  };

  // Delete Record
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application record?')) {
      try {
        await API.delete(`/uru/${id}`);
        setRecords((prev) => prev.filter((rec) => (rec.id || rec._id) !== id));
      } catch (err) {
        console.error('Failed to delete record:', err);
        alert('Failed to delete application record. Please try again.');
      }
    }
  };

  // Toggle Approval Status
  const handleToggleApprove = async (id) => {
    try {
      const res = await API.patch(`/uru/${id}/approve`);
      const updatedApproved = res.data?.data?.approved;
      setRecords((prev) =>
        prev.map((rec) => {
          if ((rec.id || rec._id) === id) {
            const nextState = updatedApproved !== undefined ? updatedApproved : !rec.approved;
            return {
              ...rec,
              approved: nextState,
              status: nextState ? 'Approved' : 'Pending',
            };
          }
          return rec;
        })
      );
    } catch (err) {
      console.error('Failed to toggle approval:', err);
      alert('Failed to toggle approval status.');
    }
  };

  return (
    <div className="mru-container">
      <div className="mru-wrapper">
        {/* Header Section */}
        <header className="mru-header-section">
          <div>
            <h1 className="mru-main-title">Manage URU Applications</h1>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
              All submitted applications initially enter in <strong>Pending</strong> state for admin verification.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button className="mru-excel-btn" onClick={handleDownloadExcel}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download Excel</span>
            </button>
          </div>
        </header>

        {/* Search Filter Bar */}
        <div className="mru-filter-section">
          <div className="mru-search-bar-wrapper">
            <input
              type="text"
              className="mru-search-input"
              placeholder="Search by Name, Application No, Email or Mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="mru-search-btn" onClick={() => {}}>
              Search
            </button>
          </div>
        </div>

        {/* Data Table Section */}
        <section className="mru-table-section">
          <div className="mru-table-responsive">
            <table className="mru-data-table">
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
                  <th className="mru-text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="mru-empty-row" style={{ padding: '30px', textAlign: 'center' }}>
                      Loading applications from database...
                    </td>
                  </tr>
                ) : filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="mru-empty-row">
                      No URU application records found.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item, index) => {
                    const recordId = item.id || item._id;
                    const isApproved = Boolean(item.approved || item.status === 'Approved');

                    return (
                      <tr key={recordId || index} className="mru-table-row">
                        <td className="mru-col-sno">{index + 1}</td>
                        <td className="mru-col-appno">
                          <strong>{item.appNo || item.applicationNumber}</strong>
                        </td>
                        <td>{item.position || 'Unique Record'}</td>
                        <td className="mru-col-name">{item.name || item.applicantName}</td>
                        <td>{item.sex || 'Other'}</td>
                        <td>{item.mobile || item.whatsappMobileNumber}</td>
                        <td>{item.email || item.emailId}</td>
                        <td>{item.country || 'India'}</td>
                        <td>{item.state || '-'}</td>
                        <td className="mru-col-actions">
                          <div className="mru-action-group">
                            <button className="mru-btn-edit" onClick={() => handleEditClick(item)}>
                              Edit
                            </button>
                            <button className="mru-btn-delete" onClick={() => handleDelete(recordId)}>
                              Delete
                            </button>
                            <button
                              className={`mru-btn-status ${isApproved ? 'approved' : 'pending'}`}
                              onClick={() => handleToggleApprove(recordId)}
                              title="Click to toggle Pending / Approved"
                            >
                              {isApproved ? 'Approved' : 'Pending'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Comprehensive Edit Popup Modal Form */}
        {isModalOpen && editingRecord && (
          <div className="mru-modal-overlay">
            <div className="mru-modal-card mru-modal-large">
              <div className="mru-modal-header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2>Edit Application Details: {editingRecord.appNo}</h2>
                    {modalLoading && (
                      <span style={{ fontSize: '11px', background: '#dbeafe', color: '#1d4ed8', padding: '3px 9px', borderRadius: '12px', fontWeight: 600 }}>
                        🔄 Fetching latest from database...
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '12px', opacity: 0.85 }}>Update any field of this application record in database</span>
                </div>
                <button className="mru-modal-close" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
              </div>

              {/* Navigation Tabs */}
              <div className="mru-modal-tabs">
                <button
                  type="button"
                  className={`mru-tab-btn ${activeTab === 'applicant' ? 'active' : ''}`}
                  onClick={() => setActiveTab('applicant')}
                >
                  👤 Applicant Details
                </button>
                <button
                  type="button"
                  className={`mru-tab-btn ${activeTab === 'record' ? 'active' : ''}`}
                  onClick={() => setActiveTab('record')}
                >
                  🏆 Record / Activity
                </button>
                <button
                  type="button"
                  className={`mru-tab-btn ${activeTab === 'files' ? 'active' : ''}`}
                  onClick={() => setActiveTab('files')}
                >
                  📁 Uploaded Files ({((editingRecord.photos?.length || 0) + (editingRecord.videos?.length || 0) + (editingRecord.documents?.length || 0))})
                </button>
                <button
                  type="button"
                  className={`mru-tab-btn ${activeTab === 'links' ? 'active' : ''}`}
                  onClick={() => setActiveTab('links')}
                >
                  🌐 Media Links
                </button>
                <button
                  type="button"
                  className={`mru-tab-btn ${activeTab === 'witness' ? 'active' : ''}`}
                  onClick={() => setActiveTab('witness')}
                >
                  👥 Witnesses
                </button>
                <button
                  type="button"
                  className={`mru-tab-btn ${activeTab === 'status' ? 'active' : ''}`}
                  onClick={() => setActiveTab('status')}
                >
                  ⚙️ Status &amp; Pricing
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="mru-modal-form mru-modal-scrollable">
                {/* TAB 1: APPLICANT DETAILS */}
                {activeTab === 'applicant' && (
                  <div className="mru-tab-pane">
                    <h3 className="mru-section-title">Personal &amp; Contact Information</h3>
                    <div className="mru-form-grid-2">
                      <div className="mru-form-group">
                        <label>Application Number</label>
                        <input
                          type="text"
                          value={editingRecord.appNo}
                          onChange={(e) => setEditingRecord({ ...editingRecord, appNo: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Position / Type</label>
                        <select
                          value={editingRecord.position}
                          onChange={(e) => setEditingRecord({ ...editingRecord, position: e.target.value })}
                        >
                          <option value="Unique Record">Unique Record</option>
                          <option value="Unique Activity">Unique Activity</option>
                        </select>
                      </div>
                      <div className="mru-form-group">
                        <label>Applicant Full Name</label>
                        <input
                          type="text"
                          value={editingRecord.name}
                          onChange={(e) => setEditingRecord({ ...editingRecord, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Gender / Sex</label>
                        <select
                          value={editingRecord.sex}
                          onChange={(e) => setEditingRecord({ ...editingRecord, sex: e.target.value })}
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="mru-form-group">
                        <label>Date of Birth</label>
                        <input
                          type="date"
                          value={editingRecord.dateOfBirth}
                          onChange={(e) => setEditingRecord({ ...editingRecord, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>WhatsApp / Mobile Number</label>
                        <input
                          type="text"
                          value={editingRecord.mobile}
                          onChange={(e) => setEditingRecord({ ...editingRecord, mobile: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Email Address</label>
                        <input
                          type="email"
                          value={editingRecord.email}
                          onChange={(e) => setEditingRecord({ ...editingRecord, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Occupation</label>
                        <input
                          type="text"
                          value={editingRecord.occupation}
                          onChange={(e) => setEditingRecord({ ...editingRecord, occupation: e.target.value })}
                          placeholder="e.g. Student, Engineer"
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Educational Qualification</label>
                        <input
                          type="text"
                          value={editingRecord.educationalQualification}
                          onChange={(e) => setEditingRecord({ ...editingRecord, educationalQualification: e.target.value })}
                          placeholder="e.g. BTech, Graduate"
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>District</label>
                        <input
                          type="text"
                          value={editingRecord.district}
                          onChange={(e) => setEditingRecord({ ...editingRecord, district: e.target.value })}
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={editingRecord.state}
                          onChange={(e) => setEditingRecord({ ...editingRecord, state: e.target.value })}
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Country</label>
                        <input
                          type="text"
                          value={editingRecord.country}
                          onChange={(e) => setEditingRecord({ ...editingRecord, country: e.target.value })}
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Pin Code</label>
                        <input
                          type="text"
                          value={editingRecord.pinCode}
                          onChange={(e) => setEditingRecord({ ...editingRecord, pinCode: e.target.value })}
                        />
                      </div>
                      <div className="mru-form-group mru-full-width">
                        <label>Full Address</label>
                        <input
                          type="text"
                          value={editingRecord.address}
                          onChange={(e) => setEditingRecord({ ...editingRecord, address: e.target.value })}
                          placeholder="Street, City, Landmark..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: RECORD / ACTIVITY */}
                {activeTab === 'record' && (
                  <div className="mru-tab-pane">
                    <h3 className="mru-section-title">Record / Activity Particulars</h3>
                    <div className="mru-form-grid-2">
                      <div className="mru-form-group">
                        <label>Record Category</label>
                        <select
                          value={editingRecord.category}
                          onChange={(e) => setEditingRecord({ ...editingRecord, category: e.target.value })}
                        >
                          <option value="Other">Other</option>
                          <option value="Science & Tech">Science &amp; Tech</option>
                          <option value="Arts & Culture">Arts &amp; Culture</option>
                          <option value="Sports">Sports</option>
                          <option value="Education">Education</option>
                          <option value="Innovation">Innovation</option>
                        </select>
                      </div>
                      <div className="mru-form-group">
                        <label>Effort Type</label>
                        <select
                          value={editingRecord.effortType}
                          onChange={(e) => setEditingRecord({ ...editingRecord, effortType: e.target.value })}
                        >
                          <option value="Individual Effort">Individual Effort</option>
                          <option value="Group Effort">Group Effort</option>
                        </select>
                      </div>
                      <div className="mru-form-group">
                        <label>Date of Attempt</label>
                        <input
                          type="date"
                          value={editingRecord.dateOfAttempt}
                          onChange={(e) => setEditingRecord({ ...editingRecord, dateOfAttempt: e.target.value })}
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Record / Activity Venue</label>
                        <input
                          type="text"
                          value={editingRecord.activityVenue}
                          onChange={(e) => setEditingRecord({ ...editingRecord, activityVenue: e.target.value })}
                          placeholder="Venue / Stadium / Location"
                        />
                      </div>
                      <div className="mru-form-group mru-full-width">
                        <label>Associated Organisation Name (if any)</label>
                        <input
                          type="text"
                          value={editingRecord.organisationName}
                          onChange={(e) => setEditingRecord({ ...editingRecord, organisationName: e.target.value })}
                          placeholder="Organisation, Institute or Club name"
                        />
                      </div>
                      <div className="mru-form-group mru-full-width">
                        <label>Record / Activity Title</label>
                        <input
                          type="text"
                          value={editingRecord.activityTitle}
                          onChange={(e) => setEditingRecord({ ...editingRecord, activityTitle: e.target.value })}
                          placeholder="Title of achievement or activity"
                          required
                        />
                      </div>
                      <div className="mru-form-group mru-full-width">
                        <label>Detailed Description</label>
                        <textarea
                          rows="3"
                          value={editingRecord.activityDescription}
                          onChange={(e) => setEditingRecord({ ...editingRecord, activityDescription: e.target.value })}
                          placeholder="Detailed description of achievement"
                        />
                      </div>
                      <div className="mru-form-group mru-full-width">
                        <label>Purpose of Attempt</label>
                        <textarea
                          rows="2"
                          value={editingRecord.activityPurpose}
                          onChange={(e) => setEditingRecord({ ...editingRecord, activityPurpose: e.target.value })}
                          placeholder="Purpose and motivation of the attempt"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: UPLOADED EVIDENCE FILES */}
                {activeTab === 'files' && (
                  <div className="mru-tab-pane">
                    <h3 className="mru-section-title">Uploaded Evidence Files (Fetched From Database)</h3>

                    {/* PHOTOS */}
                    <div className="mru-file-section">
                      <div className="mru-file-section-header">
                        <span className="mru-file-section-title">
                          <FaImage color="#2563eb" /> Uploaded Photos
                        </span>
                        <span className="mru-file-count-badge">{editingRecord.photos?.length || 0}</span>
                      </div>
                      {editingRecord.photos && editingRecord.photos.length > 0 ? (
                        <div className="mru-file-grid">
                          {editingRecord.photos.map((item, idx) => {
                            const photoUrl = typeof item === 'string' ? item : item.url;
                            const filename = (typeof item === 'object' && item.filename) ? item.filename : `Photo ${idx + 1}`;
                            return (
                              <div key={item._id || idx} className="mru-file-card">
                                <div className="mru-file-preview-box">
                                  <img src={photoUrl} alt={filename} className="mru-file-img-preview" />
                                </div>
                                <div className="mru-file-info">
                                  <span className="mru-file-name" title={filename}>{filename}</span>
                                  <div className="mru-file-actions">
                                    <a href={photoUrl} target="_blank" rel="noopener noreferrer" className="mru-file-view-btn">
                                      <FaExternalLinkAlt size={11} /> Open Photo
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mru-file-empty">No photos uploaded for this application.</div>
                      )}
                    </div>

                    {/* VIDEOS */}
                    <div className="mru-file-section">
                      <div className="mru-file-section-header">
                        <span className="mru-file-section-title">
                          <FaVideo color="#9333ea" /> Uploaded Videos
                        </span>
                        <span className="mru-file-count-badge">{editingRecord.videos?.length || 0}</span>
                      </div>
                      {editingRecord.videos && editingRecord.videos.length > 0 ? (
                        <div className="mru-file-grid">
                          {editingRecord.videos.map((item, idx) => {
                            const videoUrl = typeof item === 'string' ? item : item.url;
                            const filename = (typeof item === 'object' && item.filename) ? item.filename : `Video ${idx + 1}`;
                            return (
                              <div key={item._id || idx} className="mru-file-card">
                                <div className="mru-file-preview-box">
                                  <video src={videoUrl} controls preload="metadata" className="mru-file-video-preview" />
                                </div>
                                <div className="mru-file-info">
                                  <span className="mru-file-name" title={filename}>{filename}</span>
                                  <div className="mru-file-actions">
                                    <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mru-file-view-btn">
                                      <FaExternalLinkAlt size={11} /> Open Video
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mru-file-empty">No videos uploaded for this application.</div>
                      )}
                    </div>

                    {/* DOCUMENTS */}
                    <div className="mru-file-section">
                      <div className="mru-file-section-header">
                        <span className="mru-file-section-title">
                          <FaFilePdf color="#dc2626" /> Uploaded Documents
                        </span>
                        <span className="mru-file-count-badge">{editingRecord.documents?.length || 0}</span>
                      </div>
                      {editingRecord.documents && editingRecord.documents.length > 0 ? (
                        <div className="mru-file-grid">
                          {editingRecord.documents.map((item, idx) => {
                            const docUrl = typeof item === 'string' ? item : item.url;
                            const filename = (typeof item === 'object' && item.filename) ? item.filename : `Document ${idx + 1}`;
                            return (
                              <div key={item._id || idx} className="mru-file-card">
                                <div className="mru-file-doc-box">
                                  <FaFilePdf className="mru-file-doc-icon" />
                                  <span style={{ fontSize: '11px', color: '#64748b' }}>PDF Document</span>
                                </div>
                                <div className="mru-file-info">
                                  <span className="mru-file-name" title={filename}>{filename}</span>
                                  <div className="mru-file-actions">
                                    <a href={docUrl} target="_blank" rel="noopener noreferrer" className="mru-file-view-btn">
                                      <FaExternalLinkAlt size={11} /> View Document
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mru-file-empty">No documents uploaded for this application.</div>
                      )}
                    </div>

                    {/* CERTIFICATE IF ISSUED */}
                    {editingRecord.certificateUrl && (
                      <div className="mru-file-section">
                        <div className="mru-file-section-header">
                          <span className="mru-file-section-title">
                            <FaCertificate color="#f59e0b" /> Issued Official Certificate
                          </span>
                        </div>
                        <div className="mru-file-card" style={{ maxWidth: '300px' }}>
                          <div className="mru-file-doc-box">
                            <FaCertificate style={{ fontSize: '38px', color: '#f59e0b' }} />
                            <span style={{ fontSize: '11px', color: '#64748b' }}>Official Certificate</span>
                          </div>
                          <div className="mru-file-info">
                            <span className="mru-file-name">Certificate.pdf</span>
                            <div className="mru-file-actions">
                              <a href={editingRecord.certificateUrl} target="_blank" rel="noopener noreferrer" className="mru-file-view-btn">
                                <FaExternalLinkAlt size={11} /> View Certificate
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: MEDIA & SOCIAL LINKS */}
                {activeTab === 'links' && (
                  <div className="mru-tab-pane">
                    <h3 className="mru-section-title">Evidence &amp; Media Links</h3>
                    <div className="mru-form-grid-2">
                      <div className="mru-form-group">
                        <label>Google Drive Links (comma separated)</label>
                        <input
                          type="text"
                          value={editingRecord.googleDriveLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, googleDriveLink: e.target.value })}
                          placeholder="https://drive.google.com/..."
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>YouTube Links</label>
                        <input
                          type="text"
                          value={editingRecord.youtubeLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, youtubeLink: e.target.value })}
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Facebook Links</label>
                        <input
                          type="text"
                          value={editingRecord.facebookLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, facebookLink: e.target.value })}
                          placeholder="https://facebook.com/..."
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Instagram Links</label>
                        <input
                          type="text"
                          value={editingRecord.instagramLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, instagramLink: e.target.value })}
                          placeholder="https://instagram.com/..."
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>LinkedIn Links</label>
                        <input
                          type="text"
                          value={editingRecord.linkedInLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, linkedInLink: e.target.value })}
                          placeholder="https://linkedin.com/..."
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>X / Twitter Links</label>
                        <input
                          type="text"
                          value={editingRecord.twitterLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, twitterLink: e.target.value })}
                          placeholder="https://x.com/..."
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Pinterest Links</label>
                        <input
                          type="text"
                          value={editingRecord.pinterestLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, pinterestLink: e.target.value })}
                          placeholder="https://pinterest.com/..."
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Other Media Links</label>
                        <input
                          type="text"
                          value={editingRecord.otherMediaLink}
                          onChange={(e) => setEditingRecord({ ...editingRecord, otherMediaLink: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: WITNESSES */}
                {activeTab === 'witness' && (
                  <div className="mru-tab-pane">
                    <h3 className="mru-section-title">Witness Information</h3>
                    <div style={{ marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '14px', color: '#1d4ed8', marginBottom: '10px' }}>Witness 1</h4>
                      <div className="mru-form-grid-2">
                        <div className="mru-form-group">
                          <label>Witness 1 Name</label>
                          <input
                            type="text"
                            value={editingRecord.witness1?.name || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness1: { ...editingRecord.witness1, name: e.target.value },
                              })
                            }
                            placeholder="Full name"
                          />
                        </div>
                        <div className="mru-form-group">
                          <label>Witness 1 Designation</label>
                          <input
                            type="text"
                            value={editingRecord.witness1?.designation || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness1: { ...editingRecord.witness1, designation: e.target.value },
                              })
                            }
                            placeholder="Designation"
                          />
                        </div>
                        <div className="mru-form-group">
                          <label>Witness 1 Mobile</label>
                          <input
                            type="text"
                            value={editingRecord.witness1?.mobileNumber || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness1: { ...editingRecord.witness1, mobileNumber: e.target.value },
                              })
                            }
                            placeholder="Mobile"
                          />
                        </div>
                        <div className="mru-form-group">
                          <label>Witness 1 Email</label>
                          <input
                            type="email"
                            value={editingRecord.witness1?.emailId || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness1: { ...editingRecord.witness1, emailId: e.target.value },
                              })
                            }
                            placeholder="Email"
                          />
                        </div>
                        <div className="mru-form-group mru-full-width">
                          <label>Witness 1 Address</label>
                          <input
                            type="text"
                            value={editingRecord.witness1?.address || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness1: { ...editingRecord.witness1, address: e.target.value },
                              })
                            }
                            placeholder="Address"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '14px', color: '#1d4ed8', marginBottom: '10px' }}>Witness 2</h4>
                      <div className="mru-form-grid-2">
                        <div className="mru-form-group">
                          <label>Witness 2 Name</label>
                          <input
                            type="text"
                            value={editingRecord.witness2?.name || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness2: { ...editingRecord.witness2, name: e.target.value },
                              })
                            }
                            placeholder="Full name"
                          />
                        </div>
                        <div className="mru-form-group">
                          <label>Witness 2 Designation</label>
                          <input
                            type="text"
                            value={editingRecord.witness2?.designation || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness2: { ...editingRecord.witness2, designation: e.target.value },
                              })
                            }
                            placeholder="Designation"
                          />
                        </div>
                        <div className="mru-form-group">
                          <label>Witness 2 Mobile</label>
                          <input
                            type="text"
                            value={editingRecord.witness2?.mobileNumber || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness2: { ...editingRecord.witness2, mobileNumber: e.target.value },
                              })
                            }
                            placeholder="Mobile"
                          />
                        </div>
                        <div className="mru-form-group">
                          <label>Witness 2 Email</label>
                          <input
                            type="email"
                            value={editingRecord.witness2?.emailId || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness2: { ...editingRecord.witness2, emailId: e.target.value },
                              })
                            }
                            placeholder="Email"
                          />
                        </div>
                        <div className="mru-form-group mru-full-width">
                          <label>Witness 2 Address</label>
                          <input
                            type="text"
                            value={editingRecord.witness2?.address || ''}
                            onChange={(e) =>
                              setEditingRecord({
                                ...editingRecord,
                                witness2: { ...editingRecord.witness2, address: e.target.value },
                              })
                            }
                            placeholder="Address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: STATUS & PRICING */}
                {activeTab === 'status' && (
                  <div className="mru-tab-pane">
                    <h3 className="mru-section-title">Review &amp; Status Controls</h3>
                    <div className="mru-form-grid-2">
                      <div className="mru-form-group">
                        <label>Approval Status</label>
                        <select
                          value={editingRecord.status}
                          onChange={(e) =>
                            setEditingRecord({
                              ...editingRecord,
                              status: e.target.value,
                              approved: e.target.value === 'Approved',
                            })
                          }
                        >
                          <option value="Pending">Pending (Under Review)</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                      <div className="mru-form-group">
                        <label>Application Price (₹)</label>
                        <input
                          type="number"
                          value={editingRecord.price}
                          onChange={(e) => setEditingRecord({ ...editingRecord, price: e.target.value })}
                          placeholder="0"
                        />
                      </div>
                      <div className="mru-form-group">
                        <label>Payment Status</label>
                        <select
                          value={editingRecord.paymentStatus}
                          onChange={(e) => setEditingRecord({ ...editingRecord, paymentStatus: e.target.value })}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Success">Success</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mru-modal-actions">
                  <button type="button" className="mru-btn-cancel" onClick={() => setIsModalOpen(false)} disabled={savingEdit}>
                    Cancel
                  </button>
                  <button type="submit" className="mru-btn-save" disabled={savingEdit}>
                    {savingEdit ? 'Saving to Database...' : 'Save All Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUru;