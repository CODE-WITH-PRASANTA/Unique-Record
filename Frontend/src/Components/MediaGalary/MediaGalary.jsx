import React, { useState } from "react";
import "./MediaGalary.css";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ReactPaginate from "react-paginate";

// Assets of the Our Work Gallery
import Workgalary1 from "../../assets/work-galary-1.jpg";
import Workgalary2 from "../../assets/work-galary-2.jpg";
import Workgalary3 from "../../assets/work-galary-3.jpg";
import Workgalary4 from "../../assets/work-galary-4.jpg";
import Workgalary5 from "../../assets/work-galary-5.jpg";
import Workgalary6 from "../../assets/work-galary-6.jpg";
import Workgalary7 from "../../assets/work-galary-7.jpg";
import Workgalary8 from "../../assets/work-galary-8.jpg";
import Workgalary9 from "../../assets/work-galary-9.jpg";
import Workgalary10 from "../../assets/work-galary-10.jpg";

const MediaGalary = () => {
  const videos = [
    "https://www.youtube.com/embed/dQw4w9WgXcQ",
    "https://www.youtube.com/embed/3JZ_D3ELwOQ",
    "https://www.youtube.com/embed/tgbNymZ7vqY",
    "https://www.youtube.com/embed/oHg5SJYRHA0",
    "https://www.youtube.com/embed/L_jWHffIx5E",
    "https://www.youtube.com/embed/ZZ5LpwO-An4",
  ];

  const allProjects = [
    { id: 1, image: Workgalary1, category: "News Paper" },
    { id: 2, image: Workgalary2, category: "Online News" },
    { id: 3, image: Workgalary3, category: "News Paper" },
    { id: 4, image: Workgalary4, category: "Online News" },
    { id: 5, image: Workgalary5, category: "All Photos" },
    { id: 6, image: Workgalary6, category: "Online News" },
    { id: 7, image: Workgalary7, category: "News Paper" },
    { id: 8, image: Workgalary8, category: "Online News" },
    { id: 9, image: Workgalary9, category: "News Paper" },
    { id: 10, image: Workgalary10, category: "All Photos" },
  ];

  const [videoPage, setVideoPage] = useState(0);
  const videosPerPage = 6;

  const [photoPage, setPhotoPage] = useState(0);
  const photosPerPage = 6;

  const [selectedCategory, setSelectedCategory] = useState("All Photos");

  const handleVideoPageChange = ({ selected }) => setVideoPage(selected);
  const handlePhotoPageChange = ({ selected }) => setPhotoPage(selected);

  // Filter photos based on selected category
  const filteredPhotos =
    selectedCategory === "All Photos"
      ? allProjects
      : allProjects.filter((project) => project.category === selectedCategory);

  const paginatedPhotos = filteredPhotos.slice(
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
                  src={video}
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

        {/* Filter Buttons */}
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
          {paginatedPhotos.map((project) => (
            <div key={project.id} className="gallery-item">
              <img
                src={project.image}
                alt="Gallery Item"
                className="gallery-image"
              />
              <div className="gallery-info">
                <h4 className="gallery-category">Mr. Avishek</h4>
                <p>Pricing Got From : XXXXXX</p>
              </div>
            </div>
          ))}
        </div>

        <ReactPaginate
          previousLabel={"Prev"}
          nextLabel={"Next"}
          pageCount={Math.ceil(filteredPhotos.length / photosPerPage)}
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
