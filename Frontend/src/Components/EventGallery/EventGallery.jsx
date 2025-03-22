import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../Api"; // Adjust the path if needed
import "./EventGallery.css";
import Swal from "sweetalert2";


const EventGallery = () => {
  const [gallery, setGallery] = useState([]);
  const [image, setImage] = useState(null);
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");

  useEffect(() => {
    axios.get(`${API_URL}/eventsgalary`)
      .then(response => setGallery(response.data))
      .catch(error => console.error("Error fetching events:", error));
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      Swal.fire("Error", "Please upload an image", "error");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("instagram", instagram);
    formData.append("facebook", facebook);

    try {
      const response = await axios.post(`${API_URL}/eventsgalary/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setGallery([response.data.data, ...gallery]);
      setImage(null);
      setInstagram("");
      setFacebook("");
      document.getElementById("Event-Glary-fileInput").value = "";

      Swal.fire({
        title: "Success!",
        text: "Event uploaded successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error uploading event:", error);
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/eventsgalary/${id}`);
      setGallery(gallery.filter(event => event._id !== id));

      Swal.fire({
        title: "Deleted!",
        text: "Event deleted successfully!",
        icon: "success",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false
      });
    } catch (error) {
      console.error("Error deleting event:", error);
      Swal.fire("Error", "Failed to delete event", "error");
    }
  };

  return (
    <div className="Event-Glary-container">
      <h2 className="Event-Glary-title">Event's Gallery</h2>
      <div className="Event-Glary-content">
        {/* 📌 Form Section */}
        <form className="Event-Glary-form" onSubmit={handleSubmit}>
          <div className="Event-Glary-form-group">
            <label className="Event-Glary-label">Upload Photo:</label>
            <input type="file" id="Event-Glary-fileInput" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="Event-Glary-form-group">
            <label className="Event-Glary-label">Instagram Link:</label>
            <input type="url" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Enter Instagram URL" />
          </div>

          <div className="Event-Glary-form-group">
            <label className="Event-Glary-label">Facebook Link:</label>
            <input type="url" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Enter Facebook URL" />
          </div>

          <button type="submit" className="Event-Glary-submit-btn">Submit</button>
        </form>

        {/* 📌 Gallery Table - Placed to the right */}
        {gallery.length > 0 && (
          <div className="Event-Glary-table-container">
            <table className="Event-Glary-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Social Link</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gallery.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img src={item.imageUrl} alt="Uploaded" className="Event-Glary-thumbnail" />
                    </td>
                    <td>
                      {item.instagram && <a href={item.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
                      {item.instagram && item.facebook && <br />}
                      {item.facebook && <a href={item.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>}
                    </td>
                    <td>
                      <button className="Event-Glary-delete-btn" onClick={() => handleDelete(item._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventGallery;