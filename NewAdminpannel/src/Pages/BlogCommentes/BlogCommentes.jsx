import React, { useState } from 'react';
import './BlogCommentes.css';

const BlogCommentes = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      name: 'Prasanta Kumar Khuntia',
      email: 'pk@gmail.com',
      phone: '0637254544',
      subject: 'Inquiry about Web UI',
      address: 'Bhubaneswar, Odisha',
      message: 'Great design layout! Looking forward to more updates on React components.',
    },
    {
      id: 2,
      name: 'Ananya Mishra',
      email: 'ananya@gmail.com',
      phone: '0987654321',
      subject: 'Frontend Architecture',
      address: 'Cuttack, Odisha',
      message: 'Can you share more details about the CSS variables and responsive breakpoints?',
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
    <div className="bc-container">
      <div className="bc-wrapper">
        
        {/* Header Section */}
        <header className="bc-header-section">
          <div className="bc-title-badge">
            <span className="bc-title-icon">📝</span>
            <h1 className="bc-main-title">Blog Comments</h1>
          </div>
          <div className="bc-search-wrapper">
            <input 
              type="text" 
              className="bc-search-input" 
              placeholder="Search comments by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Table Section */}
        <section className="bc-table-section">
          <div className="bc-table-responsive">
            <table className="bc-data-table">
              <thead>
                <tr>
                  <th className="bc-col-sl">SL NO.</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>PHONE</th>
                  <th>SUBJECT</th>
                  <th>ADDRESS</th>
                  <th>MESSAGE</th>
                  <th className="bc-text-center">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="bc-empty-row">No comments found.</td>
                  </tr>
                ) : (
                  filteredComments.map((item, index) => (
                    <tr key={item.id} className="bc-table-row">
                      <td className="bc-col-sl">0{index + 1}</td>
                      <td className="bc-col-name"><strong>{item.name}</strong></td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td><strong>{item.subject}</strong></td>
                      <td>{item.address}</td>
                      <td className="bc-col-message" title={item.message}>{item.message}</td>
                      <td className="bc-col-action">
                        <div className="bc-action-group">
                          <button 
                            className="bc-btn-view" 
                            onClick={() => handleView(item)}
                          >
                            View
                          </button>
                          <button 
                            className="bc-btn-delete" 
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
          <div className="bc-modal-overlay">
            <div className="bc-modal-card">
              <div className="bc-modal-header">
                <h2>Comment Details</h2>
                <button className="bc-modal-close" onClick={() => setIsModalOpen(false)}>&times;</button>
              </div>
              <div className="bc-modal-body">
                <div className="bc-detail-group">
                  <label>Name:</label>
                  <p>{selectedComment.name}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Email:</label>
                  <p>{selectedComment.email}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Phone:</label>
                  <p>{selectedComment.phone}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Subject:</label>
                  <p>{selectedComment.subject}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Address:</label>
                  <p>{selectedComment.address}</p>
                </div>
                <div className="bc-detail-group">
                  <label>Message:</label>
                  <p className="bc-message-box">{selectedComment.message}</p>
                </div>
              </div>
              <div className="bc-modal-footer">
                <button className="bc-modal-btn-close" onClick={() => setIsModalOpen(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogCommentes;