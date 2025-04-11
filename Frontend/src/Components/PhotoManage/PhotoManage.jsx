import React, { useEffect, useState } from "react";
import axios from "axios";
import './PhotoManage.css';
import { API_URL } from "../../Api"; // adjust path based on your folder structure

const PhotoManage = () => {
  const [photos, setPhotos] = useState([]);
  const [category, setCategory] = useState('');
  const [link, setLink] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const photoAPI = `${API_URL}/photos`;

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(photoAPI);
      setPhotos(res.data);
    } catch (err) {
      console.error("Failed to fetch photos", err);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!category || !link || selectedFiles.length === 0) {
      alert("Please select category, add link, and choose at least one photo.");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("link", link);
    selectedFiles.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      setLoading(true);
      const res = await axios.post(`${photoAPI}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPhotos([...res.data, ...photos]);
      setSelectedFiles([]);
      setCategory('');
      setLink('');
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await axios.delete(`${photoAPI}/${id}`);
      setPhotos(photos.filter((photo) => photo._id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
    }
  };

  return (
    <div className="Photo-Manage-Container">
      <h2 className="Photo-Manage-Title">Photo Manager</h2>

      <div className="Photo-Manage-Form">
        <div className="Photo-Manage-Field">
          <label className="Photo-Manage-Label">Choose Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="Photo-Manage-Select"
          >
            <option value="">-- Select --</option>
            <option value="News Paper">News Paper</option>
            <option value="Online News">Online News</option>
          </select>
        </div>

        <div className="Photo-Manage-Field">
          <label className="Photo-Manage-Label">Enter Link:</label>
          <input
            type="text"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://example.com"
            className="Photo-Manage-Input"
          />
        </div>

        <div className="Photo-Manage-Field">
          <label className="Photo-Manage-Label">Select Photos:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="Photo-Manage-Input"
            onChange={handleFileChange}
          />
        </div>

        <button
          className="Photo-Manage-Upload-Button"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "📤 Upload"}
        </button>
      </div>

      <div className="Photo-Manage-Table-Section">
        {photos.length === 0 ? (
          <p className="Photo-Manage-No-Data">No photos uploaded yet.</p>
        ) : (
          <table className="Photo-Manage-Table">
            <thead className="Photo-Manage-Table-Head">
              <tr className="Photo-Manage-Table-Row">
                <th>Sl No.</th>
                <th>Photo</th>
                <th>Category</th>
                <th>Link</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="Photo-Manage-Table-Body">
              {photos.map((photo, index) => (
                <tr key={photo._id} className="Photo-Manage-Table-Row">
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={photo.imageUrl}
                      alt="Uploaded"
                      className="Photo-Manage-Thumbnail"
                    />
                  </td>
                  <td>{photo.category}</td>
                  <td>
                    <a href={photo.link} target="_blank" rel="noreferrer" className="Photo-Manage-Link">
                      {photo.link}
                    </a>
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(photo._id)}
                      className="Photo-Manage-Delete-Button"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PhotoManage;
