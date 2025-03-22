import React, { useState, useRef } from "react";
import { FaImage, FaCalendarAlt, FaUser, FaFileAlt, FaAlignLeft, FaLink, FaFileUpload } from "react-icons/fa";
import axios from "axios";
import "./AdminAddNotice.css";
import { API_URL } from "../../Api"; // Adjust the path based on your folder structure
import Swal from "sweetalert2";


const AdminAddNotice = () => {
  const [notice, setNotice] = useState({
    photo: null,
    postingDate: "",
    postOwner: "",
    title: "",
    description: "",
    link: "",
    otherFiles: null,
  });

  const fileInputRef = useRef(null);
  const otherFileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice({ ...notice, [name]: value });
  };

  const handleFileChange = (e) => {
    setNotice({ ...notice, photo: e.target.files[0] });
  };

  const handleOtherFileChange = (e) => {
    setNotice({ ...notice, otherFiles: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    Swal.fire({
      title: "Do you want to save this notice?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      denyButtonText: `Cancel`
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        formData.append("photo", notice.photo);
        formData.append("otherFiles", notice.otherFiles);
        formData.append("title", notice.title);
        formData.append("description", notice.description);
        formData.append("postingDate", notice.postingDate);
        formData.append("postOwner", notice.postOwner);
        formData.append("link", notice.link);
  
        try {
          const response = await axios.post(`${API_URL}/notices/add`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          Swal.fire("Confirm!", "Notice has Posted successfully.", "success");
          console.log("Response:", response.data);
  
          // Clear form after submission
          setNotice({
            photo: null,
            postingDate: "",
            postOwner: "",
            title: "",
            description: "",
            link: "",
            otherFiles: null,
          });
  
          fileInputRef.current.value = null;
          otherFileInputRef.current.value = null;
  
        } catch (error) {
          console.error("Error adding notice:", error);
          Swal.fire("Error!", "Failed to add notice. Please try again.", "error");
        }
  
      } else if (result.isDenied) {
        Swal.fire("Changes are not Updated", "", "info");
      }
    });
  };
  

  
  
  return (
    <div className="Adminadd-Notice-Container">
      <h2 className="Adminadd-Notice-Heading">Add Notice</h2>

      <form onSubmit={handleSubmit} className="Adminadd-Notice-Form">
        <div className="Adminadd-Notice-Row">
          <div className="Adminadd-Notice-Group Adminadd-Notice-Photo">
            <label className="Adminadd-Notice-Label">
              <FaImage className="Adminadd-Notice-Icon" /> Upload Photo
            </label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="Adminadd-Notice-Input" />
          </div>
          <div className="Adminadd-Notice-Group Adminadd-Notice-Date">
            <label className="Adminadd-Notice-Label">
              <FaCalendarAlt className="Adminadd-Notice-Icon" /> Manage Posting Date
            </label>
            <input type="date" name="postingDate" value={notice.postingDate} onChange={handleChange} className="Adminadd-Notice-Input" />
          </div>
        </div>

        <div className="Adminadd-Notice-Row">
          <div className="Adminadd-Notice-Group Adminadd-Notice-Owner">
            <label className="Adminadd-Notice-Label">
              <FaUser className="Adminadd-Notice-Icon" /> By (Post Owner Name)
            </label>
            <input type="text" name="postOwner" value={notice.postOwner} onChange={handleChange} placeholder="Enter post owner's name" className="Adminadd-Notice-Input" />
          </div>
          <div className="Adminadd-Notice-Group Adminadd-Notice-Title">
            <label className="Adminadd-Notice-Label">
              <FaFileAlt className="Adminadd-Notice-Icon" /> Notice Title
            </label>
            <input type="text" name="title" value={notice.title} onChange={handleChange} placeholder="Enter notice title" className="Adminadd-Notice-Input" />
          </div>
        </div>

        <div className="Adminadd-Notice-Group Adminadd-Notice-Description">
          <label className="Adminadd-Notice-Label">
            <FaAlignLeft className="Adminadd-Notice-Icon" /> Notice Description
          </label>
          <textarea name="description" value={notice.description} onChange={handleChange} placeholder="Enter notice description" className="Adminadd-Notice-Textarea" />
        </div>

        <div className="Adminadd-Notice-Group Adminadd-Notice-Link">
          <label className="Adminadd-Notice-Label">
            <FaLink className="Adminadd-Notice-Icon" /> Notice Link
          </label>
          <input type="text" name="link" value={notice.link} onChange={handleChange} placeholder="Enter link to the notice" className="Adminadd-Notice-Input" />
        </div>

        <div className="Adminadd-Notice-Group Adminadd-Notice-OtherFiles">
          <label className="Adminadd-Notice-Label">
            <FaFileUpload className="Adminadd-Notice-Icon" /> Upload Other Files (Optional)
          </label>
          <input type="file" ref={otherFileInputRef} onChange={handleOtherFileChange} className="Adminadd-Notice-Input" />
        </div>

        <button type="submit" className="Adminadd-Notice-SubmitBtn">Submit</button>
      </form>
    </div>
  );
};

export default AdminAddNotice;