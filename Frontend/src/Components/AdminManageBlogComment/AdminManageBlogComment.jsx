import React, { useState, useEffect } from "react";
import "./AdminManageBlogComment.css"; 
import { API_URL } from "../../Api";

const AdminManageBlogComment = () => {
  const [comments, setComments] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  // ✅ Fetch all feedbacks (admin view)
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${API_URL}/blogcmt/all-feedbacks`);
      const data = await res.json();
      if (data.success) {
        setComments(data.data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  // ✅ Toggle expand for subject/message
  const toggleExpand = (id, field) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: !prev[id]?.[field],
      },
    }));
  };

  // ✅ Delete comment
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/blogcmt/feedback/${id}`, {
        method: "DELETE",
      });
      setComments(comments.filter((c) => c._id !== id));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // ✅ Publish/Unpublish
  const handlePublish = async (id) => {
    try {
      const res = await fetch(`${API_URL}/blogcmt/feedback/${id}/toggle`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setComments(
          comments.map((c) =>
            c._id === id ? { ...c, isPublished: data.data.isPublished } : c
          )
        );
      }
    } catch (error) {
      console.error("Error toggling publish:", error);
    }
  };

  // ✅ Edit modal open
  const handleEdit = (comment) => {
    setEditing(comment._id);
    setFormData(comment);
  };

  // ✅ Save changes
  const handleSave = async () => {
    try {
      const res = await fetch(`${API_URL}/blogcmt/feedback/${editing}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setComments(
          comments.map((c) => (c._id === editing ? { ...data.data } : c))
        );
        setEditing(null);
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCancel = () => setEditing(null);

  // ✅ Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const truncate = (text, limit = 40) =>
    text.length > limit ? text.substring(0, limit) + "..." : text;

  return (
    <div className="admin-comment-container">
      <h2 className="admin-comment-title">📝 Blog Comments</h2>
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
                  : truncate(comment.subject || "", 40)}
                {comment.subject?.length > 40 && (
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
                  : truncate(comment.message || "", 50)}
                {comment.message?.length > 50 && (
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

      {/* ✅ Edit Modal */}
      {editing && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <h3>Edit Blog Comment</h3>
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

export default AdminManageBlogComment;
