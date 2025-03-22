import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiUser, FiList, FiLink, FiDownload } from "react-icons/fi";
import "./NoticeContent.css";
import { API_URL } from "../../Api"; // Ensure correct import

const NoticeSection = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(`${API_URL}/notices/all`);
        
        // Sort notices in descending order (latest first)
        const sortedNotices = response.data.sort((a, b) => new Date(b.postingDate) - new Date(a.postingDate));
        
        setNotices(sortedNotices);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };

    fetchNotices();
  }, []);

  const handleDownload = async (fileUrl) => {
    try {
      const response = await axios.get(fileUrl, { responseType: "blob" });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute("download", fileUrl.split("/").pop()); // Extract filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("File download failed:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="notice-section">
      {notices.length > 0 ? (
        notices.map((notice, index) => (
          <div className="notice-card" key={notice._id}>
            <div className="notice-image">
              <img src={notice.photo || "https://via.placeholder.com/150"} alt="Notice" />
              {notice.postingDate && (
                <div className="notice-date">
                  <span>{new Date(notice.postingDate).getDate()}</span>
                  <span>{new Date(notice.postingDate).toLocaleString("default", { month: "short" })}</span>
                  <span>{new Date(notice.postingDate).getFullYear()}</span>
                </div>
              )}
            </div>
            <div className="notice-content">
              <div className="notice-meta">
                <span><FiUser /> By {notice.postOwner || "Admin"}</span>
                <span><FiList /> Sl No. {notices.length - index}</span> {/* Latest post gets highest serial no. */}
              </div>
              <h2 className="notice-title">{notice.title}</h2>
              <p className="notice-description">{notice.description}</p>
              {notice.link && (
                <a href={notice.link} className="link-more" target="_blank" rel="noopener noreferrer">
                  Link <FiLink />
                </a>
              )}
              {notice.otherFiles && (
                <button className="download-btn" onClick={() => handleDownload(notice.otherFiles)}>
                  Download File <FiDownload />
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Loading notices...</p>
      )}
    </div>
  );
};

export default NoticeSection;
