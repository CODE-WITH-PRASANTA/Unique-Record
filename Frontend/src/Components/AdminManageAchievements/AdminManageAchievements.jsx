import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Api'; // Import the API_URL constant
import './AdminManageAchievements.css';

const AdminManageAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`${API_URL}/achievements/get-all-achievements`)
      .then(response => {
        setAchievements(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`${API_URL}/achievements/delete-achievement/${id}`)
      .then(response => {
        setAchievements(achievements.filter((achievement) => achievement._id !== id));
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleImageChange = (id, image) => {
    const formData = new FormData();
    formData.append('image', image);

    axios
      .put(`${API_URL}/achievements/update-achievement-photo/${id}`, formData)
      .then((response) => {
        setAchievements(
          achievements.map((achievement) =>
            achievement._id === id ? response.data : achievement
          )
        );
      })
      .catch((error) => {
        console.error('Upload error:', error.response?.data || error.message);
      });
  };

  const truncateText = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };

  return (
    <div className="manage-achievements-container">
      <h1 className="manage-achievements-header">Manage Achievements</h1>
      <div className="manage-achievements-table-container">
        <table className="manage-achievements-table">
          <thead className="manage-achievements-table-head">
            <tr>
              <th className="manage-achievements-table-header">Sl No.</th>
              <th className="manage-achievements-table-header">Achievement Title</th>
              <th className="manage-achievements-table-header">Achiever Name</th>
              <th className="manage-achievements-table-header">Achievement Image</th>
              <th className="manage-achievements-table-header">Change Image</th>
              <th className="manage-achievements-table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="manage-achievements-table-body">
           {achievements.map((achievement, index) => (
  <tr key={achievement._id} className="manage-achievements-table-row">
    <td className="manage-achievements-table-data">{index + 1}</td>
    <td className="manage-achievements-table-data">
      {achievement.title.length > 10 ? achievement.title.substring(0, 10) + '...' : achievement.title}
    </td>
    <td className="manage-achievements-table-data">{achievement.achieverName}</td>
    <td className="manage-achievements-table-data manage-achievements-image-container">
      <img src={achievement.image} alt={achievement.title} className="manage-achievements-image" />
    </td>
    <td className="manage-achievements-table-data manage-achievements-change-image-container">
      <input
        type="file"
        onChange={(e) => handleImageChange(achievement._id, e.target.files[0])}
        className="manage-achievements-change-image-input"
      />
    </td>
    <td className="manage-achievements-table-data manage-achievements-actions-container">
      <button className="manage-achievements-delete-btn" onClick={() => handleDelete(achievement._id)}>
        Delete
      </button>
    </td>
  </tr>
))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageAchievements;