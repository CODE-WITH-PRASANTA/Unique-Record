import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventGalary.css";
import { FaLink, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_URL } from "../../Api"; // Importing API_URL from config.js

const EventGalary = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerSlide, setImagesPerSlide] = useState(3);
  const EVENTS_GALLERY_API = `${API_URL}/eventsgalary/`; // Constructing the endpoint

  useEffect(() => {
    // Fetch event images from backend
    const fetchImages = async () => {
      try {
        const response = await axios.get(EVENTS_GALLERY_API);
        setImages(response.data); // Assuming the backend sends an array of images
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  useEffect(() => {
    const updateImagesPerSlide = () => {
      setImagesPerSlide(window.innerWidth < 768 ? 1 : 3);
    };

    updateImagesPerSlide();
    window.addEventListener("resize", updateImagesPerSlide);
    return () => window.removeEventListener("resize", updateImagesPerSlide);
  }, []);

  const totalSlides = Math.ceil(images.length / imagesPerSlide);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  return (
    <div className="event-galary-container">
      <h2 className="event-galary-heading">Our Event's Gallery</h2>

      <div className="event-galary-wrapper">
        <button className="event-galary-prev" onClick={handlePrev}>
          <FaChevronLeft />
        </button>

        <div className="event-galary-slider">
          {images
            .slice(currentIndex * imagesPerSlide, (currentIndex + 1) * imagesPerSlide)
            .map((image) => (
              <div key={image._id} className="event-galary-item">
                <img src={image.imageUrl} alt="Event" className="event-galary-img" />
                <div className="event-galary-overlay">
                  {image.instagram && (
                    <a href={image.instagram} target="_blank" rel="noopener noreferrer">
                      <FaLink className="event-galary-icon" />
                    </a>
                  )}
                  {image.facebook && (
                    <a href={image.facebook} target="_blank" rel="noopener noreferrer">
                      <FaLink className="event-galary-icon" />
                    </a>
                  )}
                </div>
              </div>
            ))}
        </div>

        <button className="event-galary-next" onClick={handleNext}>
          <FaChevronRight />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="event-galary-pagination">
        {[...Array(totalSlides)].map((_, index) => (
          <span
            key={index}
            className={`event-galary-bullet ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default EventGalary;
