import React from "react";
import "./OurVision.css";

// Assets
import mainvisionimg from "../../assets/Vision-pic.jpg";
import roundGraphic from "../../assets/round-graphic.png";
import bgPattern from "../../assets/dot-graphic.png";

const OurVision = () => {
  return (
    <section className="vision-section">
      <div className="vision-overlay"></div> {/* Background overlay for depth */}
      <div className="vision-container">
        {/* Left Content */}
        <div className="vision-content">
          <h5 className="vision-heading-small">OUR VISION & MISSION</h5>
          <h2 className="vision-heading-large">
            Creating an Impactful <span>Vision & Mission</span>
          </h2>
          <p className="vision-description">
            We are dedicated to building a future where our mission drives success
            and our vision inspires growth. Through innovation and commitment, we
            strive to make a lasting impact.
          </p>
          <ul className="vision-points">
            <li className="vision-item">
              <strong className="vision-label">VISION:</strong> To revolutionize the industry through
              sustainable innovation and forward-thinking strategies.
            </li>
            <li className="mission-item">
              <strong className="mission-label">MISSION:</strong> To deliver excellence through quality
              services and unparalleled commitment to customer satisfaction.
            </li>
          </ul>
        </div>

        {/* Right Image Section */}
        <div className="vision-image-container">
          <div className="vision-image">
            <img src={mainvisionimg} alt="Vision" className="main-image" />
          </div>
          <img src={roundGraphic} alt="Decorative" className="round-graphic" />
        </div>
      </div>
    </section>
  );
};

export default OurVision;
