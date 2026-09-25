import React, { useState } from 'react';
import './UserOpinion.css';

const UserOpinion = () => {
  // Dummy data populated for user opinions matching reference columns
  const [opinions, setOpinions] = useState([
    {
      id: 1,
      name: 'Prasanta Kumar Khuntia',
      email: 'pk@gmail.com',
      phone: '0637254544',
      age: '24',
      designation: 'Frontend Developer',
      address: 'Bhubaneswar, Odisha',
      message: 'The new UI design components are exceptionally smooth and responsive.',
      status: 'Approved',
    },
    {
      id: 2,
      name: 'Ananya Mishra',
      email: 'ananya@gmail.com',
      phone: '0987654321',
      age: '23',
      designation: 'UI/UX Designer',
      address: 'Cuttack, Odisha',
      message: 'Great attention to detail with the blue-and-white theme layout.',
      status: 'Pending',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOpinion, setSelectedOpinion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter opinions based on search input
  const filteredOpinions = opinions.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.designation.toLowerCase().includes(term) ||
      item.message.toLowerCase().includes(term)
    );
  });

  // Toggle Status Action
  const handleToggleStatus = (id) => {
    setOpinions(
      opinions.map((item) =>
        item.id === id
          ? { ...item, status: item.status === 'Approved' ? 'Pending' : 'Approved' }
          : item
      )
    );
  };

  // Open View Modal
  const handleView = (opinion) => {
    setSelectedOpinion(opinion);
    setIsModalOpen(true);
  };

  // Delete Opinion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user opinion?')) {
      setOpinions(opinions.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="uo-container">
      <div className="uo-wrapper">
        
        {/* Header Section */}
        <header className="uo-header-section">
          <div className="uo-title-badge">
            <span className="uo-title-icon">💬</span>
            <h1 className="uo-main-title">User Opinions</h1>
          </div>
          <div className="uo-search-wrapper">
            <input 
              type="text" 
              className="uo-search-input" 
              placeholder="Search opinions by name, email, designation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Table Section */}
        <section className="uo-table-section">
          <div className="uo-table-responsive">
            <table className="uo-data-table">
              <thead>
                <tr>
                  <th className="uo-col-sno">S.NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>AGE</th>
                  <th>DESIGNATION</th>
                  <th>ADDRESS</th>
                  <th>MESSAGE</th>
                  <th>STATUS</th>
                  <th className="uo-text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOpinions.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="uo-empty-row">No data available</td>
                  </tr>
                ) : (
                  filteredOpinions.map((item, index) => (
                    <tr key={item.id} className="uo-table-row">
                      <td className="uo-col-sno">0{index + 1}</td>
                      <td className="uo-col-name"><strong>{item.name}</strong></td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.age}</td>
                      <td><span className="uo-designation-pill">{item.designation}</span></td>
                      <td>{item.address}</td>
                      <td className="uo-col-message" title={item.message}>{item.message}</td>
                      <td>
                        <button 
                          className={`uo-status-badge ${item.status.toLowerCase()}`}
                          onClick={() => handleToggleStatus(item.id)}
                          title="Click to toggle status"
                        >
                          {item.status}
                        </button>
                      </td>
                      <td className="uo-col-action">
                        <div className="uo-action-group">
                          <button 
                            className="uo-btn-view" 
                            onClick={() => handleView(item)}
                          >
                            View
                          </button>
                          <button 
                            className="uo-btn-delete" 
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
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

        {/* View Details Modal */}
        {isModalOpen && selectedOpinion && (
          <div className="uo-modal-overlay">
            <div className="uo-modal-card">
              <div className="uo-modal-header">
                <h2>User Opinion Details</h2>
                <button className="uo-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="uo-modal-body">
                <div className="uo-detail-group">
                  <label>Name:</label>
                  <p>{selectedOpinion.name}</p>
                </div>
                <div className="uo-detail-group">
                  <label>Email:</label>
                  <p>{selectedOpinion.email}</p>
                </div>
                <div className="uo-detail-group">
                  <label>Phone / Age:</label>
                  <p>{selectedOpinion.phone} &bull; {selectedOpinion.age} yrs</p>
                </div>
                <div className="uo-detail-group">
                  <label>Designation:</label>
                  <p>{selectedOpinion.designation}</p>
                </div>
                <div className="uo-detail-group">
                  <label>Address:</label>
                  <p>{selectedOpinion.address}</p>
                </div>
                <div className="uo-detail-group">
                  <label>Message / Opinion:</label>
                  <p className="uo-message-box">{selectedOpinion.message}</p>
                </div>
              </div>
              <div className="uo-modal-footer">
                <button className="uo-modal-btn-close" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserOpinion;