import React, { useState } from 'react';
import './Youtube.css';

const Youtube = () => {
  const [videoLink, setVideoLink] = useState('');
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handlePublish = (e) => {
    e.preventDefault();
    if (!videoLink.trim()) return;

    if (editingId) {
      // Update existing video if in edit mode from input field
      setVideos(videos.map(video => video.id === editingId ? { ...video, link: videoLink } : video));
      setEditingId(null);
    } else {
      const newVideo = {
        id: Date.now(),
        link: videoLink,
        date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setVideos([newVideo, ...videos]);
    }
    setVideoLink('');
  };

  const handleEdit = (video) => {
    setVideoLink(video.link);
    setEditingId(video.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setVideos(videos.filter((video) => video.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setVideoLink('');
    }
  };

  return (
    <div className="yt-manager-container">
      <div className="yt-manager-wrapper">
        {/* Header Section */}
        <header className="yt-header-section">
          <div className="yt-icon-badge">
            <svg className="yt-svg-icon" viewBox="0 0 24 24" width="28" height="28">
              <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </div>
          <h1 className="yt-main-title">YouTube Video Manager</h1>
          <p className="yt-subtitle">Easily add, manage, and track your published YouTube video links in one place.</p>
        </header>

        {/* Input Form Section */}
        <form className="yt-form-section" onSubmit={handlePublish}>
          <div className={`yt-input-group ${editingId ? 'yt-editing-mode' : ''}`}>
            <input
              type="text"
              className="yt-text-input"
              placeholder="Enter YouTube video link (e.g., https://youtube.com/...)"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
            />
            <button type="submit" className="yt-publish-btn">
              <span>{editingId ? 'Update Link' : 'Publish'}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </div>
          {editingId && (
            <div className="yt-edit-indicator-bar">
              <span>Editing video entry...</span>
              <button type="button" className="yt-cancel-edit-btn" onClick={() => { setEditingId(null); setVideoLink(''); }}>Cancel</button>
            </div>
          )}
        </form>

        {/* Content List / Table Section */}
        <section className="yt-content-section">
          {videos.length === 0 ? (
            <div className="yt-empty-state">
              <div className="yt-empty-icon">📂</div>
              <p className="yt-empty-text">No videos published yet.</p>
              <span className="yt-empty-subtext">Paste a link above and click publish to get started.</span>
            </div>
          ) : (
            <div className="yt-table-container">
              <div className="yt-table-header-info">
                <h3>Published Videos</h3>
                <span className="yt-badge-count">{videos.length} Total</span>
              </div>
              <div className="yt-table-responsive">
                <table className="yt-data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Video Link</th>
                      <th>Published Date</th>
                      <th className="yt-text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.map((video, index) => (
                      <tr key={video.id} className="yt-table-row">
                        <td className="yt-col-index">0{index + 1}</td>
                        <td className="yt-col-link">
                          <a href={video.link} target="_blank" rel="noopener noreferrer" className="yt-video-link-anchor">
                            {video.link}
                          </a>
                        </td>
                        <td className="yt-col-date">{video.date}</td>
                        <td className="yt-col-action yt-text-right">
                          <div className="yt-action-btn-group">
                            <button 
                              className="yt-edit-btn" 
                              onClick={() => handleEdit(video)}
                              title="Edit video link"
                            >
                              Edit
                            </button>
                            <button 
                              className="yt-delete-btn" 
                              onClick={() => handleDelete(video.id)}
                              title="Delete video"
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

export default Youtube;