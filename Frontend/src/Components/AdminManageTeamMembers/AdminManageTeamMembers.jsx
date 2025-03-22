import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminManageTeamMembers.css";
import { FaEdit, FaTrash, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaTimes } from "react-icons/fa";
import { API_URL } from "../../Api"; // Import API_URL
import Swal from "sweetalert2";



const AdminManageTeamMembers = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [editingMember, setEditingMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Fetch Team Members from API
  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await axios.get(`${API_URL}/team/all`);
      setTeamMembers(response.data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    }
  };

  // Open edit modal
  const openEditModal = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingMember(null), 300);
  };

  // Handle edit change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingMember((prev) => ({ ...prev, [name]: value }));
  };
// Update team member with SweetAlert confirmation
const saveChanges = async () => {
  try {
    await axios.put(`${API_URL}/team/update/${editingMember._id}`, editingMember);
    fetchTeamMembers();
    closeEditModal();
    Swal.fire({
      title: "Success!",
      text: "Team member updated successfully.",
      icon: "success",
      confirmButtonColor: "#3085d6",
    });
  } catch (error) {
    Swal.fire({
      title: "Error!",
      text: "Failed to update team member.",
      icon: "error",
      confirmButtonColor: "#d33",
    });
    console.error("Error updating team member:", error);
  }
};

// Delete team member with SweetAlert confirmation
const deleteTeamMember = async (id) => {
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
        await axios.delete(`${API_URL}/team/delete/${id}`);
        fetchTeamMembers();
        Swal.fire({
          title: "Deleted!",
          text: "Team member has been deleted.",
          icon: "success",
          confirmButtonColor: "#3085d6",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete team member.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        console.error("Error deleting team member:", error);
      }
    }
  });
};
  return (
    <div className="admin-team-container">
      <h2 className="admin-team-title">Manage Team Members</h2>
      <table className="admin-team-table">
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Profile</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Social Links</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teamMembers.map((member, index) => (
            <tr key={member._id} className="admin-team-row">
              <td>{index + 1}</td>
              <td><img src={member.profilePic} alt={member.memberName} className="admin-team-profile-pic" /></td>
              <td>{member.memberName}</td>
              <td>{member.designation}</td>
              <td>{member.phoneNumber}</td>
              <td>{member.email}</td>
              <td className="admin-team-social-icons">
                {member.facebook && <a href={member.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook /></a>}
                {member.instagram && <a href={member.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram /></a>}
                {member.twitter && <a href={member.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter /></a>}
                {member.linkedin && <a href={member.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>}
              </td>
              <td>
                <button className="admin-team-edit-btn" onClick={() => openEditModal(member)}><FaEdit /></button>
                <button className="admin-team-delete-btn" onClick={() => deleteTeamMember(member._id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && editingMember && (
        <div className="admin-team-modal">
          <div className="admin-team-modal-content">
            <button className="admin-team-modal-close" onClick={closeEditModal}><FaTimes /></button>
            <h3>Edit Team Member</h3>
            <label>Name:</label>
            <input type="text" name="memberName" value={editingMember.memberName} onChange={handleEditChange} />

            <label>Designation:</label>
            <input type="text" name="designation" value={editingMember.designation} onChange={handleEditChange} />

            <label>Phone:</label>
            <input type="text" name="phoneNumber" value={editingMember.phoneNumber} onChange={handleEditChange} />

            <label>Email:</label>
            <input type="email" name="email" value={editingMember.email} onChange={handleEditChange} />

            <label>Facebook:</label>
            <input type="text" name="facebook" value={editingMember.facebook} onChange={handleEditChange} />

            <label>Instagram:</label>
            <input type="text" name="instagram" value={editingMember.instagram} onChange={handleEditChange} />

            <label>Twitter:</label>
            <input type="text" name="twitter" value={editingMember.twitter} onChange={handleEditChange} />

            <label>LinkedIn:</label>
            <input type="text" name="linkedin" value={editingMember.linkedin} onChange={handleEditChange} />

            <div className="admin-team-modal-buttons">
              <button className="admin-team-save-btn" onClick={saveChanges}>Save</button>
              <button className="admin-team-cancel-btn" onClick={closeEditModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageTeamMembers;
