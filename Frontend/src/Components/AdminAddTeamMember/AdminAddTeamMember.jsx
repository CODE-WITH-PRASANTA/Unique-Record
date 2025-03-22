import React, { useState } from "react";
import { FaUser, FaBriefcase, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaUpload } from "react-icons/fa";
import "./AdminAddTeamMember.css";
import axios from "axios";
import { API_URL } from "../../Api"; // Import API_URL
import Swal from "sweetalert2";




const AdminAddTeamMember = () => {
  const [formData, setFormData] = useState({
    profilePic: null,
    memberName: "",
    designation: "",
    phoneNumber: "",
    email: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("profilePic", formData.profilePic);
    formDataToSend.append("memberName", formData.memberName);
    formDataToSend.append("designation", formData.designation);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("facebook", formData.facebook);
    formDataToSend.append("instagram", formData.instagram);
    formDataToSend.append("twitter", formData.twitter);
    formDataToSend.append("linkedin", formData.linkedin);

    try {
      await axios.post(`${API_URL}/team/add`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        title: "Success!",
        text: "Team Member Added Successfully!",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });

      setFormData({
        profilePic: null,
        memberName: "",
        designation: "",
        phoneNumber: "",
        email: "",
        facebook: "",
        instagram: "",
        twitter: "",
        linkedin: "",
      });

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to add team member. Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };
  

  return (
    <div className="Admin-Team-Member-Container">
      <h2 className="Admin-Team-Member-Heading">Add Team Member</h2>
      <form className="Admin-Team-Member-Form" onSubmit={handleSubmit}>
        
        {/* Profile Picture Upload */}
        <div className="Admin-Team-Member-Row">
          <div className="Admin-Team-Member-Group full-width">
            <label className="Admin-Team-Member-Label">
              <FaUpload className="Admin-Team-Member-Icon" /> Upload Profile Picture:
            </label>
            <input type="file" name="profilePic" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        {/* First Row (3 fields) */}
        <div className="Admin-Team-Member-Row">
          <div className="Admin-Team-Member-Group">
            <label className="Admin-Team-Member-Label">
              <FaUser className="Admin-Team-Member-Icon" /> Member Name:
            </label>
            <input type="text" name="memberName" value={formData.memberName} onChange={handleChange} placeholder="Enter full name" required />
          </div>

          <div className="Admin-Team-Member-Group">
            <label className="Admin-Team-Member-Label">
              <FaBriefcase className="Admin-Team-Member-Icon" /> Designation:
            </label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} placeholder="Enter designation" required />
          </div>

          <div className="Admin-Team-Member-Group">
            <label className="Admin-Team-Member-Label">
              <FaPhone className="Admin-Team-Member-Icon" /> Phone Number:
            </label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter phone number" required />
          </div>
        </div>

        {/* Second Row (Email) */}
        <div className="Admin-Team-Member-Row">
          <div className="Admin-Team-Member-Group full-width">
            <label className="Admin-Team-Member-Label">
              <FaEnvelope className="Admin-Team-Member-Icon" /> Email:
            </label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" required />
          </div>
        </div>

        {/* Social Media Links Heading */}
        <h3 className="Admin-Team-Member-Social-Heading">Social Media Links</h3>

        {/* Third Row (3 Social Links) */}
        <div className="Admin-Team-Member-Row">
          <div className="Admin-Team-Member-Group">
            <label className="Admin-Team-Member-Label">
              <FaFacebook className="Admin-Team-Member-Icon" /> Facebook Link:
            </label>
            <input type="url" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="Facebook Profile URL" />
          </div>

          <div className="Admin-Team-Member-Group">
            <label className="Admin-Team-Member-Label">
              <FaInstagram className="Admin-Team-Member-Icon" /> Instagram Link:
            </label>
            <input type="url" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="Instagram Profile URL" />
          </div>

          <div className="Admin-Team-Member-Group">
            <label className="Admin-Team-Member-Label">
              <FaTwitter className="Admin-Team-Member-Icon" /> Twitter Link:
            </label>
            <input type="url" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="Twitter Profile URL" />
          </div>
        </div>

        {/* Fourth Row (LinkedIn) */}
        <div className="Admin-Team-Member-Row">
          <div className="Admin-Team-Member-Group full-width">
            <label className="Admin-Team-Member-Label">
              <FaLinkedin className="Admin-Team-Member-Icon" /> LinkedIn Link:
            </label>
            <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="LinkedIn Profile URL" />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="Admin-Team-Member-SubmitBtn">Add Team Member</button>
      </form>
    </div>
  );
};

export default AdminAddTeamMember;
