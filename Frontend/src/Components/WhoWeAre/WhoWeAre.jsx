import React from 'react';
import './WhoWeAre.css';

// Assets
import whoweareimg from '../../assets/who-we-are-img.jpg';

const WhoWeAre = () => {
  return (
    <section className="who-section about-agency">
      <div className="who-wrapper">
        <div className="who-image-wrapper">
          <img src={whoweareimg} alt="Who We Are" className="who-image" />
        </div>
        <div className="who-text-content">
          <p className="who-subheading">WHO WE ARE</p>
          <h2 className="who-heading">Unique Records of Universe™</h2>
          <p className="who-description">
          "Unique Records of Universe™" is a unit of Divya Prerak Kahaniyan Humanity Research Centre Trust  (DPKHRC Trust) which is created to recognize unique and extraordinary talents from around the world and to digitally record and showcase their work. We provide universal recognition to your unique records or activities. This process of registration and recognition has been developed very simple and easy. Its ideator is Dr. Avishek Kumar who is the Founder Chairman and Chief Managing Director of Divya Prerak Kahaniyan Humanity Research Centre Trust (DPKHRC Trust). He is a renowned litterateur and a great thinker, social worker and nature lover.
          </p>
          <div className="who-info-box">
            <p className="who-info-title">About URU Web Portal Development</p>
            <ul className="who-info-list">
              <li className="who-info-item">Certification</li>
              <li className="who-info-item">License Card</li>
              <li className="who-info-item">5+ Years Experience</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="who-stats-container">
        <div className="who-stat-box">
          <p className="who-stat-number">15Y</p>
          <p className="who-stat-text">Business Work</p>
        </div>
        <div className="who-stat-box">
          <p className="who-stat-number">500+</p>
          <p className="who-stat-text">Success Building</p>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
