import React from "react";
import "./OurMainVision.css";
import { FaPlay } from "react-icons/fa";
import VisionRightimg from "../../assets/Vision-img-1.png";

const OurMainVision = () => {
  return (
    <section className="main-vision-section">
      <div className="main-vision-container">
        {/* Left Content */}
        <div className="main-vision-left">
          <h4 className="main-vision-subtitle">Our Vision</h4>
          <h2 className="main-vision-title">Our Main Vision</h2>
          <p className="main-vision-paragraph">
          Our vision is to create awareness among people through a special initiative called "Unique Records of Universe" that you can record your amazing, unique work or achievement in the digital archives of the universe. There is a constant effort to ensure that the inspiring records and activities created by people from all over the country and the world are present in a systematic manner on this web portal.
          </p>
          <h3 className="main-vision-title">What is the Vision or objective..?</h3>

          <p className="main-vision-paragraph">
          The main objective of our vision is to encourage people to digitally preserve their extraordinary work and achievements. So that the coming generation can take inspiration from them and develop a spirit of achieving something in them.
          </p>
          <div className="main-vision-buttons">
            <button className="main-vision-btn-donate">Explore Now</button>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="main-vision-btn-vdo"
            >
              <FaPlay className="main-vision-icon" />
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="main-vision-right">
          <img
            src={VisionRightimg}
            alt="Helping Each Other"
            className="main-vision-image"
          />
        </div>
      </div>
    </section>
  );
};

export default OurMainVision;
