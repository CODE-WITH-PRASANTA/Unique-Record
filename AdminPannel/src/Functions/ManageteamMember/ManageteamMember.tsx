import React, { useState, ChangeEvent, FormEvent } from "react";
import "./ManageteamMember.css";
import {
  FaEdit,
  FaTrashAlt,
  FaSave,
  FaTimes,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";

interface TeamMember {
  id: number;
  profile: string;
  name: string;
  designation: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  twitter: string;
  linkedin: string;
}

const ManageteamMember: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Omit<TeamMember, "id">>({
    profile: "",
    name: "",
    designation: "",
    phone: "",
    email: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
  });
  const [editData, setEditData] = useState<Partial<TeamMember>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setFormData({ ...formData, profile: reader.result as string });
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddMember = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert("Please fill all required fields!");
      return;
    }

    const newMember: TeamMember = { ...formData, id: Date.now() };
    setMembers([...members, newMember]);

    setFormData({
      profile: "",
      name: "",
      designation: "",
      phone: "",
      email: "",
      instagram: "",
      facebook: "",
      twitter: "",
      linkedin: "",
    });
  };

  const handleDelete = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const handleEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setEditData({ ...m });
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSaveEdit = () => {
    if (editingId !== null) {
      setMembers(members.map((m) => (m.id === editingId ? { ...m, ...editData } as TeamMember : m)));
      setEditingId(null);
    }
  };

  const handleCancelEdit = () => setEditingId(null);

  return (
    <div className="ManageTeamMember-wrapper">
      {/* Left Section */}
      <section className="ManageTeamMember-section ManageTeamMember-formSection">
        <h2 className="ManageTeamMember-title">👨‍💼 Add Team Member</h2>
        <form onSubmit={handleAddMember} className="ManageTeamMember-formBox">
          <div className="ManageTeamMember-uploadBox">
            <label className="ManageTeamMember-label">
              <MdAddAPhoto className="ManageTeamMember-uploadIcon" /> Upload Profile Picture:
            </label>
            <input type="file" name="profile" accept="image/*" onChange={handleChange} />
          </div>

          <div className="ManageTeamMember-row">
            <div className="ManageTeamMember-inputGroup">
              <label>Member Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
              />
            </div>
            <div className="ManageTeamMember-inputGroup">
              <label>Designation:</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                placeholder="Enter designation"
              />
            </div>
          </div>

          <div className="ManageTeamMember-row">
            <div className="ManageTeamMember-inputGroup">
              <label>Phone Number:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter contact number"
              />
            </div>
            <div className="ManageTeamMember-inputGroup">
              <label>Email Address:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <h3 className="ManageTeamMember-subtitle">🌐 Social Media Links</h3>
          <div className="ManageTeamMember-row">
            <div className="ManageTeamMember-inputGroup">
              <label><FaInstagram /> Instagram:</label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                placeholder="Instagram URL"
              />
            </div>
            <div className="ManageTeamMember-inputGroup">
              <label><FaFacebookF /> Facebook:</label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="Facebook URL"
              />
            </div>
          </div>

          <div className="ManageTeamMember-row">
            <div className="ManageTeamMember-inputGroup">
              <label><FaTwitter /> Twitter:</label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                placeholder="Twitter URL"
              />
            </div>
            <div className="ManageTeamMember-inputGroup">
              <label><FaLinkedinIn /> LinkedIn:</label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
              />
            </div>
          </div>

          <button type="submit" className="ManageTeamMember-btnAdd">
            ➕ Add Team Member
          </button>
        </form>
      </section>

      {/* Right Section */}
      <section className="ManageTeamMember-section ManageTeamMember-listSection">
        <h2 className="ManageTeamMember-title">🧾 Manage Team Members</h2>
        <div className="ManageTeamMember-tableContainer">
          <table className="ManageTeamMember-table">
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
              {members.length === 0 ? (
                <tr>
                  <td colSpan={8} className="ManageTeamMember-emptyMsg">
                    No team members added yet.
                  </td>
                </tr>
              ) : (
                members.map((m, i) => (
                  <tr key={m.id}>
                    <td>{i + 1}</td>
                    <td>
                      {m.profile ? (
                        <img src={m.profile} alt="profile" className="ManageTeamMember-avatar" />
                      ) : (
                        "N/A"
                      )}
                    </td>

                    {editingId === m.id ? (
                      <>
                        <td><input name="name" value={editData.name || ""} onChange={handleEditChange} /></td>
                        <td><input name="designation" value={editData.designation || ""} onChange={handleEditChange} /></td>
                        <td><input name="phone" value={editData.phone || ""} onChange={handleEditChange} /></td>
                        <td><input name="email" value={editData.email || ""} onChange={handleEditChange} /></td>
                        <td><input name="linkedin" value={editData.linkedin || ""} onChange={handleEditChange} /></td>
                        <td>
                          <FaSave className="ManageTeamMember-icon save" onClick={handleSaveEdit} />
                          <FaTimes className="ManageTeamMember-icon cancel" onClick={handleCancelEdit} />
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{m.name}</td>
                        <td>{m.designation}</td>
                        <td>{m.phone}</td>
                        <td>{m.email}</td>
                        <td className="ManageTeamMember-socialIcons">
                          {m.instagram && <a href={m.instagram} target="_blank"><FaInstagram /></a>}
                          {m.facebook && <a href={m.facebook} target="_blank"><FaFacebookF /></a>}
                          {m.twitter && <a href={m.twitter} target="_blank"><FaTwitter /></a>}
                          {m.linkedin && <a href={m.linkedin} target="_blank"><FaLinkedinIn /></a>}
                        </td>
                        <td>
                          <FaEdit className="ManageTeamMember-icon edit" onClick={() => handleEdit(m)} />
                          <FaTrashAlt className="ManageTeamMember-icon delete" onClick={() => handleDelete(m.id)} />
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default ManageteamMember;
