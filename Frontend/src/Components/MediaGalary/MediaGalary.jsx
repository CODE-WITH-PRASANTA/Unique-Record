import React, { useState, useEffect } from "react";
import "./MediaGalary.css";
import "swiper/css";
import "swiper/css/pagination";
import ReactPaginate from "react-paginate";
import axios from "axios";
import { API_URL } from "../../Api"; // adjust path as needed

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
        setVideos(response.data); // assuming response.data is an array of video objects
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);


useEffect(() => {
  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`${API_URL}/photos`, {
        params: { category: selectedCategory },
      });
      
      setPhotos(response.data);
    } catch (error) {
      console.error("Error fetching photos:", error);
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
          {videos
            .slice(videoPage * videosPerPage, (videoPage + 1) * videosPerPage)
            .map((video, index) => (
              <div className="video-box" key={index}>
                <iframe
                  src={video.embedLink}
                  title={`video-${index}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="video-frame"
                ></iframe>
              </div>
            ))}
        </div>
        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={"Next"}
          pageCount={Math.ceil(videos.length / videosPerPage)}
          onPageChange={handleVideoPageChange}
          containerClassName={"pagination-buttons"}
          activeClassName={"active-button"}
          disabledClassName={"disabled"}
        />
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
  {paginatedPhotos.map((photo) => (
    <div key={photo._id} className="gallery-item">
      <img
        src={photo.imageUrl}
        alt="Gallery Item"
        className="gallery-image"
      />
      <div className="gallery-info">
        <h4 className="gallery-category">{photo.category}</h4>
        <p>Link: <a href={photo.link}>{photo.link}</a></p>
      </div>
    </div>
  ))}
</div>


<ReactPaginate
  previousLabel={"Prev"}
  nextLabel={"Next"}
  pageCount={Math.ceil(photos.length / photosPerPage)}
  onPageChange={handlePhotoPageChange}
  containerClassName={"pagination-buttons"}
  activeClassName={"active-button"}
  disabledClassName={"disabled"}
/>

      </div>
    </>
  );
};

export default MediaGalary;
