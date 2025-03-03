import React from "react";
import "./LearnMoreLogo.css";

// Assets
import mainvisionimg from "../../assets/Vision-pic.jpg";
import roundGraphic from "../../assets/round-graphic.png";


const LearnMoreLogo = () => {
  return (
    <section className="LearnMore-Logo-section">
      <div className="LearnMore-Logo-overlay"></div> {/* Background overlay for depth */}
      <div className="LearnMore-Logo-container">
        {/* Left Content */}
        <div className="LearnMore-Logo-content">
          <h5 className="LearnMore-Logo-heading-small">URU Symbol & Logo</h5>
          <h2 className="LearnMore-Logo-heading-large">
          May everyone be happy and well ,  <span>May the fragrant flowers of peace, harmony, unity, brotherhood, love and cooperation bloom in the world.</span>
          </h2>
          <p className="LearnMore-Logo-description">
          This Logo is in a circular shape, with a rainbow band of seven colors. There is a small circle in the center of the circle, showing a sun and some planets. "Unique Records of Universe" is written around the circle.
          </p>
          <br />
          <p className="LearnMore-Logo-description">
          This logo represents the Unique Records of Universe. The rainbow band symbolizes the diversity and beauty of the universe. The sun and planets represent the various celestial bodies present in the universe, which are somehow directly or indirectly connected to us. The words "Unique Records of Universe" represent the unique and important events and objects present in the universe.
          </p>
          <ul className="LearnMore-Logo-points">
            <li className="LearnMore-Logo-item">
              <strong className="LearnMore-Logo-label">Importance of Logo : </strong> This logo reminds of the vastness and diversity of the universe, and inspires to know and understand more about it. This logo is important for those who value knowledge and information. This logo encourages them to learn new things and expand their knowledge.
            </li>
            <li className="mission-item">
              <strong className="mission-label">Conclusion of Logo :</strong> This logo is a powerful symbol that represents the universe, knowledge and curiosity. This logo is a source of inspiration for all those who want to record their amazing, unique feats in the universe on this web portal or want to take some inspiration from the achievements of others.
            </li>
          </ul>
        </div>

        {/* Right Image Section */}
        <div className="LearnMore-Logo-image-container">
          <div className="LearnMore-Logo-image">
            <img src={mainvisionimg} alt="LearnMore-Logo" className="main-image" />
          </div>
          <img src={roundGraphic} alt="Decorative" className="round-graphic" />
        </div>
      </div>
    </section>
  );
};

export default LearnMoreLogo;
