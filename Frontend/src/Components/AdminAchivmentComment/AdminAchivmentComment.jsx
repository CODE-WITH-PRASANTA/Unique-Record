import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from '../../Api';
import "./AdminAchivmentComment.css";
import Swal from "sweetalert2";


const AdminAchivmentComment = () => {
  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchComments();
  }, []);
  
const fetchComments = async () => {
  try {
    const response = await axios.get(`${API_URL}/comment/all-feedbacks`); // 👈 fetch all
    setComments(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const toggleExpand = (id, field) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field],
      },
    }));
  };


const handleDelete = async (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/comment/feedback/${id}`);
        setComments(comments.filter((c) => c._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Something went wrong while deleting.",
          icon: "error",
        });
      }
    }
  });
};

  const handlePublish = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/comment/feedback/${id}/publish`);
      setComments(
        comments.map((c) =>
          c._id === id ? { ...c, isPublished: response.data.isPublished } : c
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (comment) => {
    setEditing(comment._id);
    setFormData(comment);
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_URL}/comment/feedback/${editing}`, formData);
      setComments(
        comments.map((c) => (c._id === editing ? { ...response.data } : c))
      );
      setEditing(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setEditing(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const truncate = (text, limit = 40) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  return (
    <div className="admin-comment-container">
      <h2 className="admin-comment-title">🏆 Achievement Comments</h2>
      <table className="admin-comment-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Subject</th>
            <th>Address</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment, index) => (
            <tr key={comment._id}>
              <td>{index + 1}</td>
              <td>{comment.name}</td>
              <td>{comment.email}</td>
              <td>{comment.phone}</td>
              <td className="admin-comment-subject">
                {expanded[comment._id]?.subject
                  ? comment.subject
                  : truncate(comment.subject, 40)}
                {comment.subject.length > 40 && (
                  <button
                    className="admin-readmore-btn"
                    onClick={() => toggleExpand(comment._id, "subject")}
                  >
                    {expanded[comment._id]?.subject ? "Show Less" : "Read More"}
                  </button>
                )}
              </td>
              <td>{comment.address}</td>
              <td className="admin-comment-message">
                {expanded[comment._id]?.message
                  ? comment.message
                  : truncate(comment.message, 50)}
                {comment.message.length > 50 && (
                  <button
                    className="admin-readmore-btn"
                    onClick={() => toggleExpand(comment._id, "message")}
                  >
                    {expanded[comment._id]?.message ? "Show Less" : "Read More"}
                  </button>
                )}
              </td>
              <td className="admin-comment-actions">
                <button
                  className={`btn publish ${
                    comment.isPublished ? "unpublish" : ""
                  }`}
                  onClick={() => handlePublish(comment._id)}
                >
                  {comment.isPublished ? "Unpublish" : "Publish"}
                </button>
                <button
                  className="btn edit"
                  onClick={() => handleEdit(comment)}
                >
                  Edit
                </button>
                <button
                  className="btn delete"
                  onClick={() => handleDelete(comment._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Edit Comment</h3>
            <form>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows="4"
              />
              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="btn save"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn cancel"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAchivmentComment;