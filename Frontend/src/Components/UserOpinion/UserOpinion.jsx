import React, { useState, useEffect } from 'react';
import './UserOpinion.css';
import { API_URL } from '../../Api'; 
import Swal from "sweetalert2";

const UserOpinion = () => {
  const [data, setData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data from backend
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/freequotes`);
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      } else {
        setError("Failed to load data");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a quote
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
          const response = await fetch(`${API_URL}/freequotes/${id}`, {
            method: "DELETE",
          });
          const resultData = await response.json();

          if (response.ok) {
            setData((prev) => prev.filter((item) => item._id !== id));

            Swal.fire({
              title: "Deleted!",
              text: resultData.message || "Your file has been deleted.",
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: resultData.message || "Delete failed!",
              icon: "error",
            });
          }
        } catch (err) {
          console.error(err);
          Swal.fire({
            title: "Error!",
            text: "Something went wrong while deleting.",
            icon: "error",
          });
        }
      }
    });
  };

  // ✅ Publish / Unpublish a quote
  const handleTogglePublish = async (id, currentStatus) => {
    try {
      const response = await fetch(`${API_URL}/freequotes/${id}/publish`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      const resultData = await response.json();

      if (response.ok) {
        setData((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isPublished: !currentStatus } : item
          )
        );

        Swal.fire({
          title: "Success!",
          text: resultData.message,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: resultData.message || "Failed to update publish status.",
          icon: "error",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Something went wrong while updating publish status.",
        icon: "error",
      });
    }
  };

  // Toggle Read More/Less
  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="UserOpinion-container">
      <h2 className="UserOpinion-title">User Opinions</h2>

      {loading && <p className="UserOpinion-loading">Loading...</p>}
      {error && <p className="UserOpinion-error">{error}</p>}

      <div className="UserOpinion-table-wrapper">
        <table className="UserOpinion-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Age</th>
              <th>Designation</th>
              <th>Address</th>
              <th>Message</th>
              <th>Status</th> {/* ✅ new column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.age || "-"}</td>
                  <td>{user.designation || "-"}</td>
                  <td>{user.address || "-"}</td>
                  <td>
                    <div
                      className={`UserOpinion-message ${
                        expanded[user._id] ? "expanded" : ""
                      }`}
                    >
                      {user.message}
                    </div>
                    {user.message.length > 100 && (
                      <button
                        className="UserOpinion-readmore-btn"
                        onClick={() => toggleExpand(user._id)}
                      >
                        {expanded[user._id] ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </td>
                  {/* ✅ Publish status column */}
                  <td>
                    {user.isPublished ? (
                      <span className="status published">Published</span>
                    ) : (
                      <span className="status unpublished">Unpublished</span>
                    )}
                  </td>
                  <td>
                    {/* ✅ Publish/Unpublish button */}
                    <button
                      className={`UserOpinion-publish-btn ${
                        user.isPublished ? "unpublish" : "publish"
                      }`}
                      onClick={() =>
                        handleTogglePublish(user._id, user.isPublished)
                      }
                    >
                      {user.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <button
                      className="UserOpinion-delete-btn"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOpinion;
