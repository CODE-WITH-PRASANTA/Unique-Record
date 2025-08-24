import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminManageHomeMedia.css';
import { API_URL } from '../../Api'; // or '../config/api' depending on file structure
import Swal from "sweetalert2";


const API_BASE_URL = `${API_URL}/home-media`;

const AdminManageHomeMedia = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing media on mount
  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/all`);
      setUploadedImages(res.data);
    } catch (error) {
      console.error('Error fetching media:', error);
    }
  };
  

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadedImages((prev) => [...res.data, ...prev]);
      setSelectedFiles([]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
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
        await axios.delete(`${API_BASE_URL}/${id}`);
        setUploadedImages((prev) => prev.filter((img) => img._id !== id));

        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire({
          title: "Error!",
          text: "Delete failed. Try again.",
          icon: "error",
        });
      }
    }
  });
};

  return (
    <div className="Admin-Manage-HomeMedia-Container">
      <h2 className="Admin-Manage-HomeMedia-Title">Home Media Upload</h2>

      <div className="Admin-Manage-HomeMedia-UploadSection">
        <input
          type="file"
          accept="image/*"
          multiple
          className="Admin-Manage-HomeMedia-Input"
          onChange={handleFileChange}
        />
        <button
          className="Admin-Manage-HomeMedia-UploadBtn"
          onClick={handleUpload}
          disabled={!selectedFiles.length || loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div className="Admin-Manage-HomeMedia-TableContainer">
        <table className="Admin-Manage-HomeMedia-Table">
          <thead>
            <tr>
              <th>Sl No.</th>
              <th>Preview</th>
              <th>File Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((img, index) => (
                <tr key={img._id}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={img.url}
                      alt={img.name}
                      className="Admin-Manage-HomeMedia-Preview"
                    />
                  </td>
                  <td>{img.name}</td>
                  <td>
                    <button
                      className="Admin-Manage-HomeMedia-DeleteBtn"
                      onClick={() => handleDelete(img._id)}
                      title="Delete"
                    >
                      ✖
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No media uploaded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageHomeMedia;
