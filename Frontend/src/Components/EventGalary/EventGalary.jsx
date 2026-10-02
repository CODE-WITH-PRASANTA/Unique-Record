import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventGalary.css";
import { FaLink, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { API_URL } from "../../Api";

const EventGalary = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesPerSlide, setImagesPerSlide] = useState(3);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${API_URL}/gallery`);
        const data = response.data;
        if (Array.isArray(data)) {
          setImages(data);
        } else if (data && Array.isArray(data.data)) {
          setImages(data.data);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        try {
          const res = await axios.get(`${API_URL}/eventsgalary`);
          const d = res.data;
          if (Array.isArray(d)) {
            setImages(d);
          } else if (d && Array.isArray(d.data)) {
            setImages(d.data);
          }
        } catch (err2) {
          console.error("Fallback error fetching event gallery:", err2);
        }
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

  const totalSlides = Math.max(1, Math.ceil(images.length / imagesPerSlide));

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="event-galary-container">
      <h2 className="event-galary-heading">Our Event's Gallery</h2>

      <div className="event-galary-wrapper">
        <button className="event-galary-prev" onClick={handlePrev} aria-label="Previous">
          <FaChevronLeft />
        </button>

        <div className="event-galary-slider">
          {images
            .slice(currentIndex * imagesPerSlide, (currentIndex + 1) * imagesPerSlide)
            .map((image, idx) => {
              const imgSrc = image.imageUrl || image.photoUrl;
              return (
                <div key={image._id || image.id || idx} className="event-galary-item">
                  <img src={imgSrc} alt="Event" className="event-galary-img" />
                  <div className="event-galary-overlay">
                    {image.instagram && (
                      <a href={image.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                        <FaLink className="event-galary-icon" />
                      </a>
                    )}
                    {image.facebook && (
                      <a href={image.facebook} target="_blank" rel="noopener noreferrer" title="Facebook">
                        <FaLink className="event-galary-icon" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <button className="event-galary-next" onClick={handleNext} aria-label="Next">
          <FaChevronRight />
        </button>
      </div>

      {/* Pagination Dots */}
      {totalSlides > 1 && (
        <div className="event-galary-pagination">
          {[...Array(totalSlides)].map((_, index) => (
            <span
              key={index}
              className={`event-galary-bullet ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventGalary;
