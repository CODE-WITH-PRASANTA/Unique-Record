import React, { useState, useEffect } from 'react';
import './YoutubeManage.css';
import axios from 'axios';
import { API_URL } from '../../Api'; // adjust the path based on your file structure

const API_BASE_URL = `${API_URL}/youtube`;

const YoutubeManage = () => {
  const [link, setLink] = useState('');
  const [videos, setVideos] = useState([]);

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!link.trim()) return alert('Please enter a YouTube link');

    try {
      const res = await axios.post(API_BASE_URL, { link: link.trim() });
      setVideos([res.data, ...videos]);
      setLink('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add video');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setVideos(videos.filter((video) => video._id !== id));
    } catch (err) {
      alert('Failed to delete video');
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get(API_BASE_URL);
        setVideos(res.data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="youtube-manage-container">
      <h2 className="youtube-manage-title">YouTube Video Manager</h2>

      <form className="youtube-manage-form" onSubmit={handlePublish}>
        <input
          type="url"
          className="youtube-manage-input"
          placeholder="Enter YouTube video link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <button type="submit" className="youtube-manage-publish-btn">Publish</button>
      </form>

      <div className="youtube-manage-table-section">
        {videos.length === 0 ? (
          <p className="youtube-manage-no-data">No videos published yet.</p>
        ) : (
          <table className="youtube-manage-table">
            <thead className="youtube-manage-thead">
              <tr>
                <th className="youtube-manage-th">Sl No.</th>
                <th className="youtube-manage-th">Video Preview</th>
                <th className="youtube-manage-th">YouTube Link</th>
                <th className="youtube-manage-th">Delete</th>
              </tr>
            </thead>
            <tbody className="youtube-manage-tbody">
              {videos.map((video, index) => (
                <tr key={video._id} className="youtube-manage-row">
                  <td className="youtube-manage-td">{index + 1}</td>
                  <td className="youtube-manage-td">
                    <iframe
                      width="320"
                      height="180"
                      src={video.embedLink}
                      frameBorder="0"
                      allowFullScreen
                      title={`Video ${index + 1}`}
                      className="youtube-manage-iframe"
                    />
                  </td>
                  <td className="youtube-manage-td">{video.link}</td>
                  <td className="youtube-manage-td">
                    <button
                      className="youtube-manage-delete-btn"
                      onClick={() => handleDelete(video._id)}
                      title="Delete Video"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default YoutubeManage;
