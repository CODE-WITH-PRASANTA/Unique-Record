import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Api"; // Import the API URL
import "./AdminManageNotice.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";


const AdminManageNotice = () => {
  const [notices, setNotices] = useState([]);
  const [editNotice, setEditNotice] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  // Fetch all notices
  const fetchNotices = async () => {
    try {
      const response = await axios.get(`${API_URL}/notices/all`);
      setNotices(response.data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    }
  };

  // Truncate text for better UI
  const truncateText = (text, wordLimit = 4) => {
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  // Edit Notice
  const handleEditClick = (notice) => {
    setEditNotice({ ...notice });
    setTimeout(() => {
      document.querySelector(".Admin-Notice-EditPopup").classList.add("show");
    }, 10);
  };

  const handleClosePopup = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Unsaved changes will be lost!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, close it",
      cancelButtonText: "No, keep editing"
    }).then((result) => {
      if (result.isConfirmed) {
        document.querySelector(".Admin-Notice-EditPopup").classList.remove("show");
        setTimeout(() => {
          setEditNotice(null);
        }, 400);
      }
    });
  };
  

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API_URL}/notices/update/${editNotice._id}`, editNotice);
      fetchNotices();
      setEditNotice(null);
      Swal.fire("Updated!", "The notice has been updated successfully.", "success");
    } catch (error) {
      console.error("Error updating notice:", error);
      Swal.fire("Error!", "Failed to update the notice.", "error");
    }
  };
  

  const handleDeleteNotice = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/notices/delete/${id}`);
          fetchNotices();
          Swal.fire("Deleted!", "The notice has been deleted.", "success");
        } catch (error) {
          console.error("Error deleting notice:", error);
          Swal.fire("Error!", "Failed to delete the notice.", "error");
        }
      }
    });
  };
  

  return (
    <div className="Admin-Notice-Container">
      <h2 className="Admin-Notice-Header">Manage Notices</h2>
      <table className="Admin-Notice-Table">
        <thead className="Admin-Notice-TableHead">
          <tr className="Admin-Notice-TableRow">
            <th className="Admin-Notice-TableHeader">Sl No.</th>
            <th className="Admin-Notice-TableHeader">Title</th>
            <th className="Admin-Notice-TableHeader">Description</th>
            <th className="Admin-Notice-TableHeader">Posting Date</th>
            <th className="Admin-Notice-TableHeader">Owner Name</th>
            <th className="Admin-Notice-TableHeader">Notice Link</th>
            <th className="Admin-Notice-TableHeader">Action</th>
          </tr>
        </thead>
        <tbody className="Admin-Notice-TableBody">
          {notices.map((notice, index) => (
            <tr key={notice._id} className="Admin-Notice-TableRow">
              <td className="Admin-Notice-TableData">{index + 1}</td>
              <td className="Admin-Notice-TableData">{truncateText(notice.title)}</td>
              <td className="Admin-Notice-TableData">{truncateText(notice.description)}</td>
              <td className="Admin-Notice-TableData">{new Date(notice.postingDate).toLocaleDateString()}</td>
              <td className="Admin-Notice-TableData">{notice.postOwner}</td>
              <td className="Admin-Notice-TableData">
                <a href={notice.link} target="_blank" rel="noopener noreferrer" className="Admin-Notice-Link">
                  View Notice
                </a>
              </td>
              <td className="Admin-Notice-TableData">
                <button className="Admin-Notice-EditBtn" onClick={() => handleEditClick(notice)}>
                  <FaEdit /> Edit
                </button>
                <button className="Admin-Notice-DeleteBtn" onClick={() => handleDeleteNotice(notice._id)}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Popup */}
      {editNotice && (
        <div className="Admin-Notice-EditPopup">
          <div className="Admin-Notice-EditContent">
            <h3>Edit Notice</h3>

            <label>Title:</label>
            <input
              type="text"
              value={editNotice.title}
              onChange={(e) => setEditNotice({ ...editNotice, title: e.target.value })}
            />

            <label>Description:</label>
            <textarea
              value={editNotice.description}
              onChange={(e) => setEditNotice({ ...editNotice, description: e.target.value })}
            />

            <label>Posting Date:</label>
            <input
              type="date"
              value={new Date(editNotice.postingDate).toISOString().split("T")[0]}
              onChange={(e) => setEditNotice({ ...editNotice, postingDate: e.target.value })}
            />

            <label>Owner Name:</label>
            <input
              type="text"
              value={editNotice.postOwner}
              onChange={(e) => setEditNotice({ ...editNotice, postOwner: e.target.value })}
            />

            <label>Notice Link:</label>
            <input
              type="text"
              value={editNotice.link}
              onChange={(e) => setEditNotice({ ...editNotice, link: e.target.value })}
            />

            <div className="Admin-Notice-EditButtons">
              <button className="Admin-Notice-SaveBtn" onClick={handleSaveEdit}>
                Save
              </button>
              <button className="Admin-Notice-CancelBtn" onClick={handleClosePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageNotice;
