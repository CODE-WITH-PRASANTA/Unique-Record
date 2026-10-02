import React, { useState, useEffect } from "react";
import "./MediaGalary.css";
import "swiper/css";
import "swiper/css/pagination";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { API_URL } from "../../Api";

const MediaGalary = () => {
  const [videos, setVideos] = useState([]);
  const [videoPage, setVideoPage] = useState(0);
  const videosPerPage = 6;

  const [photoPage, setPhotoPage] = useState(0);
  const photosPerPage = 6;
  const [selectedCategory, setSelectedCategory] = useState("All Photos");
  const [photos, setPhotos] = useState([]);

  // Fetch videos from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${API_URL}/youtube`);
        const data = response.data;
        if (Array.isArray(data)) {
          setVideos(data);
        } else if (data && Array.isArray(data.data)) {
          setVideos(data.data);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  // Fetch photos / gallery items from backend
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const params = {};
        if (selectedCategory !== "All Photos") {
          params.category = selectedCategory;
        }

        const response = await axios.get(`${API_URL}/gallery`, { params });
        const data = response.data;
        if (Array.isArray(data)) {
          setPhotos(data);
        } else if (data && Array.isArray(data.data)) {
          setPhotos(data.data);
        }
      } catch (error) {
        console.error("Error fetching photos:", error);
        // Fallback to /photos or /eventsgalary
        try {
          const fallbackRes = await axios.get(`${API_URL}/eventsgalary`);
          const d = fallbackRes.data;
          if (Array.isArray(d)) {
            setPhotos(d);
          } else if (d && Array.isArray(d.data)) {
            setPhotos(d.data);
          }
        } catch (err2) {
          console.error("Fallback error fetching photos:", err2);
        }
      }
    };

    fetchPhotos();
  }, [selectedCategory]);

  const handleVideoPageChange = ({ selected }) => setVideoPage(selected);
  const handlePhotoPageChange = ({ selected }) => setPhotoPage(selected);

  const paginatedPhotos = photos.slice(
    photoPage * photosPerPage,
    (photoPage + 1) * photosPerPage
  );

  return (
    <>
      {/* Video Gallery Section */}
      <div className="video-gallery">
        <h2>Video Gallery</h2>
        <div className="video-container" key={videoPage}>
          {videos.length > 0 ? (
            videos
              .slice(videoPage * videosPerPage, (videoPage + 1) * videosPerPage)
              .map((video, index) => (
                <div className="video-box" key={video._id || index}>
                  <iframe
                    src={video.embedLink || video.link}
                    title={`video-${index}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-frame"
                  ></iframe>
                </div>
              ))
          ) : (
            <p className="no-videos-text" style={{ textAlign: "center", width: "100%", padding: "20px" }}>
              No videos available yet.
            </p>
          )}
        </div>
        {videos.length > videosPerPage && (
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            pageCount={Math.ceil(videos.length / videosPerPage)}
            onPageChange={handleVideoPageChange}
            containerClassName={"pagination-buttons"}
            activeClassName={"active-button"}
            disabledClassName={"disabled"}
          />
        )}
      </div>

      {/* Photo Gallery Section */}
      <div className="pic-gallery-section">
        <h2 className="gallery-title">Our Photo Gallery</h2>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${
              selectedCategory === "All Photos" ? "active-filter" : ""
            }`}
            onClick={() => {
              setSelectedCategory("All Photos");
              setPhotoPage(0);
            }}
          >
            All Photos
          </button>
          <button
            className={`filter-btn ${
              selectedCategory === "Events" ? "active-filter" : ""
            }`}
            onClick={() => {
              setSelectedCategory("Events");
              setPhotoPage(0);
            }}
          >
            Events
          </button>
          <button
            className={`filter-btn ${
              selectedCategory === "News Paper" ? "active-filter" : ""
            }`}
            onClick={() => {
              setSelectedCategory("News Paper");
              setPhotoPage(0);
            }}
          >
            News Paper
          </button>
          <button
            className={`filter-btn ${
              selectedCategory === "Online News" ? "active-filter" : ""
            }`}
            onClick={() => {
              setSelectedCategory("Online News");
              setPhotoPage(0);
            }}
          >
            Online News
          </button>
        </div>

        <div className="gallery-grid" key={photoPage}>
          {paginatedPhotos.length > 0 ? (
            paginatedPhotos.map((photo, index) => {
              const photoImg = photo.imageUrl || photo.photoUrl || photo.image;
              const photoSocialLink = photo.instagram || photo.facebook || photo.link;

              return (
                <div key={photo._id || photo.id || index} className="gallery-item">
                  <div className="gallery-image-wrapper">
                    <img
                      src={photoImg}
                      alt={photo.category || "Gallery Item"}
                      className="gallery-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=60";
                      }}
                    />
                  </div>
                  <div className="gallery-info">
                    <h4 className="gallery-category">{photo.category || "Events"}</h4>
                    {photoSocialLink && (
                      <p>
                        Link:{" "}
                        <a
                          href={photoSocialLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {photo.instagram ? "Instagram Post" : photo.facebook ? "Facebook Post" : photoSocialLink}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p style={{ textAlign: "center", gridColumn: "1 / -1", padding: "40px", color: "#666" }}>
              No photos found in this category.
            </p>
          )}
        </div>

        {photos.length > photosPerPage && (
          <ReactPaginate
            previousLabel={"Prev"}
            nextLabel={"Next"}
            pageCount={Math.ceil(photos.length / photosPerPage)}
            onPageChange={handlePhotoPageChange}
            containerClassName={"pagination-buttons"}
            activeClassName={"active-button"}
            disabledClassName={"disabled"}
          />
        )}
      </div>
    </>
  );
};

export default MediaGalary;
