import React from "react";
import "./OurVision.css";

// Assets
import mainvisionimg from "../../assets/Vision-pic.jpg";
import roundGraphic from "../../assets/round-graphic.png";

const OurVision = () => {
  return (
    <section className="vision-section">
      <div className="vision-overlay"></div> {/* Background overlay for depth */}
      <div className="vision-container">
        {/* Left Content */}
        <div className="vision-content">
          <h5 className="vision-heading-small">OUR VISION & MISSION</h5>
          <h2 className="vision-heading-large">
          The Beginning of an Impressive  <span>Vision & Mission</span>
          </h2>
          <p className="vision-description">
          Our vision is to digitally preserve the extraordinary achievements of people through the “Unique Records of Universe” so that future generations are inspired. This initiative encourages people to record their talents and efforts in universal archives, thereby spreading positivity and inspiration. This is a unique platform so far, which promotes good deeds and shows the path to success.
          </p>
          <ul className="vision-points">
            <li className="vision-item">
              <strong className="vision-label">VISION:</strong> We aim to inspire future generations by digitally preserving world-wide achievements.
            </li>
            <li className="mission-item">
              <strong className="mission-label">MISSION:</strong> We provide a platform for people to digitally preserve and share their extraordinary achievements, to spread inspiration and knowledge.
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
