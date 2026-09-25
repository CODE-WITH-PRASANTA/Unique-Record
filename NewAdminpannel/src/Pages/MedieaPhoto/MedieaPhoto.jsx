import React, { useState, useEffect } from 'react';
import './MedieaPhoto.css';

const MedieaPhoto = () => {
  const [category, setCategory] = useState('');
  const [photoLink, setPhotoLink] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('No file chosen');
  const [selectedFile, setSelectedFile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Cleanup object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      photos.forEach(photo => {
        if (photo.imageSrc && photo.imageSrc.startsWith('blob:')) {
          URL.revokeObjectURL(photo.imageSrc);
        }
      });
    };
  }, [photos]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedFileName(file.name);
    } else {
      setSelectedFile(null);
      setSelectedFileName('No file chosen');
    }
  };

  const handleUpload = (e) => {
    e.preventDefault();
    if (!category || (!photoLink.trim() && !selectedFile && !editingId)) {
      alert('Please select a category and provide either a link or select a file.');
      return;
    }

    let imageSrc = '';
    if (selectedFile) {
      imageSrc = URL.createObjectURL(selectedFile);
    } else if (photoLink.trim()) {
      imageSrc = photoLink.trim();
    }

    if (editingId) {
      // Update existing photo record
      setPhotos(photos.map(p => {
        // If a new local file or link is provided, use it; otherwise, keep existing imageSrc
        const updatedImageSrc = imageSrc || p.imageSrc;
        return p.id === editingId ? {
          ...p,
          category,
          link: photoLink.trim() || p.link,
          fileName: selectedFile ? selectedFile.name : p.fileName,
          imageSrc: updatedImageSrc
        } : p;
      }));
      setEditingId(null);
    } else {
      // Add new photo record
      const newPhoto = {
        id: Date.now(),
        category,
        link: photoLink.trim() || 'Local File Upload',
        fileName: selectedFile ? selectedFile.name : 'None',
        imageSrc: imageSrc,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setPhotos([newPhoto, ...photos]);
    }

    // Reset Form
    setCategory('');
    setPhotoLink('');
    setSelectedFile(null);
    setSelectedFileName('No file chosen');
  };

  const handleEdit = (photo) => {
    setCategory(photo.category);
    setPhotoLink(photo.link === 'Local File Upload' ? '' : photo.link);
    setSelectedFileName(photo.fileName);
    setSelectedFile(null);
    setEditingId(photo.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setPhotos(photos.filter(p => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setCategory('');
      setPhotoLink('');
      setSelectedFile(null);
      setSelectedFileName('No file chosen');
    }
  };

  return (
    <div className="mp-manager-container">
      <div className="mp-manager-wrapper">
        
        {/* Header Section */}
        <header className="mp-header-section">
          <div className="mp-icon-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
          <h1 className="mp-main-title">Photo Manager</h1>
          <p className="mp-subtitle">Organize, upload, and manage your image gallery links and files efficiently.</p>
        </header>

        {/* Upload Form Card Section */}
        <form className="mp-form-card" onSubmit={handleUpload}>
          
          {/* Category Selection */}
          <div className="mp-form-group">
            <label className="mp-label">Choose Category:</label>
            <div className="mp-select-wrapper">
              <select 
                className="mp-select-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>-- Select --</option>
                <option value="Nature & Outdoors">Nature & Outdoors</option>
                <option value="Architecture">Architecture</option>
                <option value="Portraits">Portraits</option>
                <option value="Events & Parties">Events & Parties</option>
                <option value="Abstract & Art">Abstract & Art</option>
              </select>
            </div>
          </div>

          {/* Link Input */}
          <div className="mp-form-group">
            <label className="mp-label">Enter Link:</label>
            <input 
              type="text" 
              className="mp-text-input" 
              placeholder="https://example.com/photo.jpg"
              value={photoLink}
              onChange={(e) => setPhotoLink(e.target.value)}
            />
          </div>

          {/* File Picker */}
          <div className="mp-form-group">
            <label className="mp-label">Select Photos:</label>
            <div className="mp-file-picker-container">
              <label className="mp-file-custom-btn">
                Choose Files
                <input 
                  type="file" 
                  className="mp-file-hidden-input" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <span className="mp-file-name-display">{selectedFileName}</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="mp-form-actions">
            <button type="submit" className="mp-upload-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              <span>{editingId ? 'Update Photo' : 'Upload'}</span>
            </button>
            {editingId && (
              <button 
                type="button" 
                className="mp-cancel-btn"
                onClick={() => {
                  setEditingId(null);
                  setCategory('');
                  setPhotoLink('');
                  setSelectedFile(null);
                  setSelectedFileName('No file chosen');
                }}
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>

        {/* Content List / Table Section */}
        <section className="mp-content-section">
          {photos.length === 0 ? (
            <div className="mp-empty-state">
              <div className="mp-empty-icon">🖼️</div>
              <p className="mp-empty-text">No photos uploaded yet.</p>
              <span className="mp-empty-subtext">Fill out the form above and click upload to add items.</span>
            </div>
          ) : (
            <div className="mp-table-container">
              <div className="mp-table-header-info">
                <h3>Uploaded Photo Gallery</h3>
                <span className="mp-badge-count">{photos.length} Total</span>
              </div>
              <div className="mp-table-responsive">
                <table className="mp-data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Preview</th>
                      <th>Category</th>
                      <th>Source / Link</th>
                      <th>File Name</th>
                      <th>Date Added</th>
                      <th className="mp-text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {photos.map((photo, index) => (
                      <tr key={photo.id} className="mp-table-row">
                        <td className="mp-col-index">0{index + 1}</td>
                        <td className="mp-col-preview">
                          <div className="mp-thumbnail-wrapper">
                            {photo.imageSrc ? (
                              <img 
                                src={photo.imageSrc} 
                                alt="Thumbnail" 
                                className="mp-table-thumbnail" 
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextSibling) {
                                    e.target.nextSibling.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div className="mp-thumbnail-placeholder" style={{ display: photo.imageSrc ? 'none' : 'flex' }}>
                              <span>No Img</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="mp-category-pill">{photo.category}</span>
                        </td>
                        <td className="mp-col-link">
                          {photo.link === 'Local File Upload' ? (
                            <span className="mp-muted-text">Local Upload</span>
                          ) : (
                            <a href={photo.link} target="_blank" rel="noopener noreferrer" className="mp-link-anchor">
                              {photo.link}
                            </a>
                          )}
                        </td>
                        <td className="mp-col-filename">{photo.fileName}</td>
                        <td className="mp-col-date">{photo.date}</td>
                        <td className="mp-col-action mp-text-right">
                          <div className="mp-action-btn-group">
                            <button 
                              className="mp-edit-action-btn" 
                              onClick={() => handleEdit(photo)}
                              title="Edit item"
                            >
                              Edit
                            </button>
                            <button 
                              className="mp-delete-action-btn" 
                              onClick={() => handleDelete(photo.id)}
                              title="Delete item"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  );
};

export default MedieaPhoto;