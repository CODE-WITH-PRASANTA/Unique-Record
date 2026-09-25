import React, { useState } from 'react';
import './ManageUru.css';

const ManageUru = () => {
  // Initial Mock Data based on the reference UI
  const [records, setRecords] = useState([
    {
      id: 1,
      appNo: 'URU3778',
      position: 'Unique Record',
      name: 'Prasanta Kumar Khuntia',
      sex: 'Female',
      mobile: '0637254544',
      email: 'pk@gmail.com',
      country: 'India',
      state: 'Odisha',
      approved: true,
    },
    {
      id: 2,
      appNo: 'URU6310',
      position: 'Unique Record',
      name: 'Prasanta Kumar Khuntia',
      sex: 'Female',
      mobile: '0637254544',
      email: 'pk@gmail.com',
      country: 'India',
      state: 'Odisha',
      approved: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // Filter records based on search query
  const filteredRecords = records.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.appNo.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.mobile.includes(term)
    );
  });

  // Fully Working Excel Download Functionality (CSV format compatible with Excel)
  const handleDownloadExcel = () => {
    if (records.length === 0) {
      alert('No data available to download.');
      return;
    }

    const headers = ['S.No.', 'Application Number', 'Position', 'Applicant Name', 'Sex', 'Whatsapp Mobile Number', 'Email Id', 'Country', 'State', 'Status'];
    
    const rows = filteredRecords.map((item, index) => [
      index + 1,
      item.appNo,
      item.position,
      `"${item.name}"`, // Wrap in quotes to handle spaces safely
      item.sex,
      item.mobile,
      item.email,
      item.country,
      item.state,
      item.approved ? 'Approved' : 'Pending'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Manage_URU_Records_${new Date().toISOString().slice(0,10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Edit Modal
  const handleEditClick = (record) => {
    setEditingRecord({ ...record });
    setIsModalOpen(true);
  };

  // Save Edited Record from Modal Form
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setRecords(records.map((rec) => (rec.id === editingRecord.id ? editingRecord : rec)));
    setIsModalOpen(false);
    setEditingRecord(null);
  };

  // Delete Record
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(records.filter((rec) => rec.id !== id));
    }
  };

  // Toggle Approval Status
  const handleToggleApprove = (id) => {
    setRecords(
      records.map((rec) => (rec.id === id ? { ...rec, approved: !rec.approved } : rec))
    );
  };

  return (
    <div className="mru-container">
      <div className="mru-wrapper">
        
        {/* Header Section */}
        <header className="mru-header-section">
          <h1 className="mru-main-title">Manage URU</h1>
          <button className="mru-excel-btn" onClick={handleDownloadExcel}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            <span>Download Excel</span>
          </button>
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
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="mru-empty-row">No records found.</td>
                  </tr>
                ) : (
                  filteredRecords.map((item, index) => (
                    <tr key={item.id} className="mru-table-row">
                      <td className="mru-col-sno">{index + 1}</td>
                      <td className="mru-col-appno"><strong>{item.appNo}</strong></td>
                      <td>{item.position}</td>
                      <td className="mru-col-name">{item.name}</td>
                      <td>{item.sex}</td>
                      <td>{item.mobile}</td>
                      <td>{item.email}</td>
                      <td>{item.country}</td>
                      <td>{item.state}</td>
                      <td className="mru-col-actions">
                        <div className="mru-action-group">
                          <button 
                            className="mru-btn-edit" 
                            onClick={() => handleEditClick(item)}
                          >
                            Edit
                          </button>
                          <button 
                            className="mru-btn-delete" 
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                          <button 
                            className={`mru-btn-status ${item.approved ? 'approved' : 'pending'}`}
                            onClick={() => handleToggleApprove(item.id)}
                          >
                            {item.approved ? 'Approved' : 'Pending'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Edit Popup Modal Form */}
        {isModalOpen && editingRecord && (
          <div className="mru-modal-overlay">
            <div className="mru-modal-card">
              <div className="mru-modal-header">
                <h2>Edit Application Record</h2>
                <button className="mru-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <form onSubmit={handleSaveEdit} className="mru-modal-form">
                <div className="mru-form-group">
                  <label>Applicant Name</label>
                  <input 
                    type="text" 
                    value={editingRecord.name} 
                    onChange={(e) => setEditingRecord({...editingRecord, name: e.target.value})}
                    required 
                  />
                </div>
                <div className="mru-form-group">
                  <label>Application Number</label>
                  <input 
                    type="text" 
                    value={editingRecord.appNo} 
                    onChange={(e) => setEditingRecord({...editingRecord, appNo: e.target.value})}
                    required 
                  />
                </div>
                <div className="mru-form-group">
                  <label>Position</label>
                  <input 
                    type="text" 
                    value={editingRecord.position} 
                    onChange={(e) => setEditingRecord({...editingRecord, position: e.target.value})}
                    required 
                  />
                </div>
                <div className="mru-form-group">
                  <label>Email ID</label>
                  <input 
                    type="email" 
                    value={editingRecord.email} 
                    onChange={(e) => setEditingRecord({...editingRecord, email: e.target.value})}
                    required 
                  />
                </div>
                <div className="mru-form-group">
                  <label>Mobile Number</label>
                  <input 
                    type="text" 
                    value={editingRecord.mobile} 
                    onChange={(e) => setEditingRecord({...editingRecord, mobile: e.target.value})}
                    required 
                  />
                </div>
                <div className="mru-modal-actions">
                  <button type="button" className="mru-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="mru-btn-save">Save Changes</button>
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