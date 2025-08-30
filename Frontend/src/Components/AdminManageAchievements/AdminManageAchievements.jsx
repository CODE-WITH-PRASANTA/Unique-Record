import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../Api'; 
import './AdminManageAchievements.css';
import Swal from "sweetalert2";

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
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/achievements/delete-achievement/${id}`)
          .then((response) => {
            setAchievements((prev) =>
              prev.filter((achievement) => achievement._id !== id)
            );
            Swal.fire({
              title: "Deleted!",
              text: "Achievement has been deleted.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
              title: "Error!",
              text: "Something went wrong while deleting.",
              icon: "error",
            });
          });
      }
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

  // NEW: Handle Publish / Unpublish
  const handleTogglePublish = (id, isPublished) => {
    const url = isPublished
      ? `${API_URL}/achievements/unpublish-achievement/${id}`
      : `${API_URL}/achievements/publish-achievement/${id}`;

    axios.put(url)
      .then((response) => {
        setAchievements(
          achievements.map((achievement) =>
            achievement._id === id
              ? { ...achievement, isPublished: !isPublished }
              : achievement
          )
        );
        Swal.fire({
          title: "Success!",
          text: `Achievement has been ${isPublished ? 'unpublished' : 'published'}.`,
          icon: "success",
        });
      })
      .catch((error) => {
        console.error('Publish toggle error:', error.response?.data || error.message);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while updating publish status.",
          icon: "error",
        });
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
                  {truncateText(achievement.title, 10)}
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
                  <button
                    className={`publish-toggle-btn ${achievement.isPublished ? 'published' : 'unpublished'}`}
                    onClick={() => handleTogglePublish(achievement._id, achievement.isPublished)}
                  >
                    {achievement.isPublished ? 'Published' : 'Unpublished'}
                  </button>

                  <button
                    className="manage-achievements-delete-btn"
                    onClick={() => handleDelete(achievement._id)}
                  >
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
