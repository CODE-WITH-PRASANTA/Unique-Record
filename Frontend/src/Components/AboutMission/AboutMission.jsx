import React, { useState } from "react";
import "./AboutMission.css";
import { FaUser, FaDollarSign, FaRegPlayCircle } from "react-icons/fa";
import Rightsidemissionimg from "../../assets/mission-right-img.jpg";

const AboutMission = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const handleVideoOpen = () => setIsVideoOpen(true);
  const handleVideoClose = () => setIsVideoOpen(false);

  return (
    <div className="about-mission-container">
      {/* Mission Content Section */}
      <div className="about-mission-content">
        <h2 className="mission-title">Our Mission <span>Is To FindHouse</span> </h2>
        <p className="mission-intro">
          Mauris ac consectetur ante, dapibus gravida tellus. Nullam aliquet
          eleifend dapibus. Cras sagittis, ex euismod lacinia tempor.
        </p>
        <p className="mission-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis
          ligula eu luctus vulputate porttitor sed feugiat nunc. Mauris ac
          consectetur ante, dapibus gravida tellus. Nullam aliquet eleifend
          dapibus. Cras sagittis, ex euismod lacinia tempor, lectus orci
          elementum augue, eget auctor metus ante sit amet velit.
        </p>
        <p className="mission-text">
          Maecenas quis viverra metus, et efficitur ligula. Nam congue augue et
          ex congue, sed luctus lectus congue. Integer convallis condimentum
          sem. Duis elementum tortor eget condimentum tempor.
        </p>

        {/* Mission Statistics */}
        <div className="mission-stats">
          <div className="stat-item">
            <FaUser className="stat-icon" />
            <h3>80,123</h3>
            <p>Customers to date</p>
          </div>
          <div className="stat-item">
            <FaDollarSign className="stat-icon" />
            <h3>$74 Billion</h3>
            <p>In home sales</p>
          </div>
          <div className="stat-item">
            <FaDollarSign className="stat-icon" />
            <h3>$468 Million</h3>
            <p>In Savings</p>
          </div>
        </div>
      </div>

      {/* Right-Side Mission Image Section */}
      <div className="about-mission-image">
        <img
          src={Rightsidemissionimg}
          alt="Mission"
          className="mission-image"
        />
        <button
          onClick={handleVideoOpen}
          className="popup_video_btn"
          aria-label="Play Video"
        >
          <FaRegPlayCircle />
        </button>
      </div>

      {/* Video Modal Section */}
      {isVideoOpen && (
        <div className="video-modal">
          <div className="video-modal-content">
            <button onClick={handleVideoClose} className="close-btn">
              ×
            </button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/your-video-id"
              title="Mission Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutMission;
