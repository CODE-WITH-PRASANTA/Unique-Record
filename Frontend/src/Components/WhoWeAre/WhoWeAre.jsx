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
          <h2 className="who-heading">WE ARE BEST & PROFESSIONAL TEAM CONSTRUCTION</h2>
          <p className="who-description">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
          <div className="who-info-box">
            <p className="who-info-title">WE BUILD YOUR FUTURE DREAM BUILDING CONSTRUCTION</p>
            <ul className="who-info-list">
              <li className="who-info-item">Certification Worker</li>
              <li className="who-info-item">License Card</li>
              <li className="who-info-item">5+ Years Experience Worker</li>
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
