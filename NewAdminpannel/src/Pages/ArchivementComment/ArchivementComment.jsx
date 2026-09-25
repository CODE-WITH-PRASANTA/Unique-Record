import React, { useState } from 'react';
import './ArchivementComment.css';

const ArchivementComment = () => {
  // Dummy data matching reference columns (SL NO, NAME, EMAIL, PHONE, SUBJECT, ADDRESS, MESSAGE, ACTION)
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Prasanta Kumar Khuntia',
      email: 'pk@gmail.com',
      phone: '0637254544',
      subject: 'Inquiry about Achievement',
      address: 'Bhubaneswar, Odisha',
      message: 'Amazing milestone! Heartiest congratulations on the recent success.',
    },
    {
      id: 2,
      name: 'Ananya Mishra',
      email: 'ananya@gmail.com',
      phone: '0987654321',
      subject: 'Recognition Feedback',
      address: 'Cuttack, Odisha',
      message: 'Very inspiring journey and well-deserved recognition.',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComment, setSelectedComment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter comments based on search input
  const filteredComments = comments.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term) ||
      item.subject.toLowerCase().includes(term) ||
      item.message.toLowerCase().includes(term)
    );
  });

  // Open View Modal
  const handleView = (comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  // Delete Comment
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      setComments(comments.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="ac-container">
      <div className="ac-wrapper">
        
        {/* Header Section */}
        <header className="ac-header-section">
          <div className="ac-title-badge">
            <span className="ac-title-icon">🏆</span>
            <h1 className="ac-main-title">Achievement Comments</h1>
          </div>
          <div className="ac-search-wrapper">
            <input 
              type="text" 
              className="ac-search-input" 
              placeholder="Search comments by name, subject, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Table Section */}
        <section className="ac-table-section">
          <div className="ac-table-responsive">
            <table className="ac-data-table">
              <thead>
                <tr>
                  <th className="ac-col-sl">SL NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>SUBJECT</th>
                  <th>ADDRESS</th>
                  <th>MESSAGE</th>
                  <th className="ac-text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="ac-empty-row">No comments found.</td>
                  </tr>
                ) : (
                  filteredComments.map((item, index) => (
                    <tr key={item.id} className="ac-table-row">
                      <td className="ac-col-sl">0{index + 1}</td>
                      <td className="ac-col-name"><strong>{item.name}</strong></td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td className="ac-col-subject"><strong>{item.subject}</strong></td>
                      <td>{item.address}</td>
                      <td className="ac-col-message" title={item.message}>{item.message}</td>
                      <td className="ac-col-action">
                        <div className="ac-action-group">
                          <button 
                            className="ac-btn-view" 
                            onClick={() => handleView(item)}
                          >
                            View
                          </button>
                          <button 
                            className="ac-btn-delete" 
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
        {isModalOpen && selectedComment && (
          <div className="ac-modal-overlay">
            <div className="ac-modal-card">
              <div className="ac-modal-header">
                <h2>Achievement Comment Details</h2>
                <button className="ac-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="ac-modal-body">
                <div className="ac-detail-group">
                  <label>Name:</label>
                  <p>{selectedComment.name}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Email:</label>
                  <p>{selectedComment.email}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Phone:</label>
                  <p>{selectedComment.phone}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Subject:</label>
                  <p><strong>{selectedComment.subject}</strong></p>
                </div>
                <div className="ac-detail-group">
                  <label>Address:</label>
                  <p>{selectedComment.address}</p>
                </div>
                <div className="ac-detail-group">
                  <label>Message:</label>
                  <p className="ac-message-box">{selectedComment.message}</p>
                </div>
              </div>
              <div className="ac-modal-footer">
                <button className="ac-modal-btn-close" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ArchivementComment;