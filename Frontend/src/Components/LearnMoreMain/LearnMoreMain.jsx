import React from 'react';
import './LearnMoreMain.css';


// Assets
import whoweareimg from '../../assets/who-we-are-img.jpg';


const LearnMoreMain = () => {
  return (
    <section className="LearnMore-Main-section about-agency">
      <div className="LearnMore-Main-wrapper">
        <div className="LearnMore-Main-image-wrapper">
          <img src={whoweareimg} alt="LearnMore-Main We Are" className="LearnMore-Main-image" />
        </div>
        <div className="LearnMore-Main-text-content">
          <p className="LearnMore-Main-subheading">Unique Records of Universe</p>
          <h2 className="LearnMore-Main-heading">Celebrating Amazing Achievements in 100+ Categories</h2>
          <p className="LearnMore-Main-description">
          Unique Records of Universe is a platform that celebrates human excellence and diversity. It recognizes unique and extraordinary achievements across 100+ broad categories, spanning nature, compound power, science, arts, humanities, and social sectors. It's a place where exceptional individuals who challenge the limits of talent, dedication, and innovation are honored.
          <br />
        The purpose of these 100+ categories is not just to record world records, but to inspire individuals and groups to go beyond their limits and achieve something extraordinary. It is a platform that encourages creativity, knowledge, and amazing, unique and extraordinary human endeavors. It should be clearly noted that we do not encourage anyone to create records by risking their lives.
          </p>
  
        </div>
      </div>
    </section>
  );
};

export default LearnMoreMain;
