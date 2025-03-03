import React from "react";
import "./LearnMoreContent.css";
import { FaPlay } from "react-icons/fa";
import VisionRightimg from "../../assets/Vision-img-1.png";

const LearnMoreContent = () => {
  return (
    <section className="LearnMore-Content-section">
      <div className="LearnMore-Content-container">
        {/* Left Content */}
        <div className="LearnMore-Content-left">
          <h4 className="LearnMore-Content-subtitle">Unique Records of Universe</h4>
          <h2 className="LearnMore-Content-title">A Broad Canvas</h2>
          <p className="LearnMore-Content-paragraph">
          The categories of Universe Records are diverse and comprehensive, reflecting almost every aspect of the human experience. Some categories focus on scientific and technological achievements, such as "AI Technology," "Geology," "Astronomy," and "Electric Vehicle." At the same time, some categories highlight artistic and cultural expressions, such as "Dance," "Painting," "Fashion and Design," and "Indian Civilization Culture."
        Additionally, many categories emphasize spiritual, social, and humanitarian aspects, such as "Women Empowerment and Leadership," "Social Work and Development," "International Peace," and "Humanity Research." Sports, nature, health, yoga, spirituality, and even children's talents are also recognized in these categories.

          </p>
          <h3 className="LearnMore-Content-title">Source of Inspiration and Recognition</h3>

          <p className="LearnMore-Content-paragraph">
          Unique Records of Universe aims not just to record records. It is an inspiring platform that encourages people to recognize and achieve their potential. It honors those who seek excellence in their respective fields, whether it is science, art, sports, or any other field.
        This platform not only recognizes and honors individual achievements, but also inspires communities and nations. It creates a positive and encouraging environment that inspires people to strive for a better future.

          </p>
          <h3 className="LearnMore-Content-title">Towards the Future</h3>

          <p className="LearnMore-Content-paragraph">
          The "Unique Records of Universe" platform, run by the DPKHRC Trust, is constantly being developed and expanded. New categories are being added, and continuous efforts are being made to make existing categories more inclusive and relevant. This platform is poised to reach even greater heights in the coming years and is committed to bringing forth new stories of human excellence.
          </p>
          <div className="LearnMore-Content-buttons">
            <button className="LearnMore-Content-btn-donate">Explore Now</button>
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="LearnMore-Content-btn-vdo"
            >
              <FaPlay className="LearnMore-Content-icon" />
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="LearnMore-Content-right">
          <img
            src={VisionRightimg}
            alt="Helping Each Other"
            className="LearnMore-Content-image"
          />
        </div>
      </div>
    </section>
  );
};

export default LearnMoreContent;
