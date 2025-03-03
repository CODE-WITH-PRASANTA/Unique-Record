import React, { useEffect, useRef, useState } from 'react';
import './HomeAbout.css';

// Assets
import aboutoneimg from '../../assets/about-one-img-1.jpg';
import abouttwoimg from '../../assets/about-one-img-2.jpg';
import yellowarrowshape from '../../assets/about-one-shape-1.png';

const HomeAbout = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer to trigger animation when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.5 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className={`home-about ${isVisible ? 'animate' : ''}`} ref={sectionRef}>
      <div className="home-about-container">
        {/* Left Side with Images */}
        <div className={`about-images ${isVisible ? 'animate-images' : ''}`}>
          <img src={aboutoneimg} alt="Business Team" className="about-main-img" />
          <img src={abouttwoimg} alt="Discussion" className="about-secondary-img" />
          <div className="certified-badge">
            <p className="certified-text">📜 Certified Digital Certificate</p>
          </div>
        </div>

        {/* Right Side with Text */}
        <div className="about-content">
          <p className="about-subtitle">🟡🟡🟡 GET TO KNOW US</p>
          <h2 className="about-title">Unique Records of Universe</h2>
          <p className="about-highlight">
          Celebrating Amazing Achievements in 100+ Categories
          </p>
          <p className="about-description">
          Unique Records of Universe is a platform that celebrates human excellence and diversity. It recognizes unique and extraordinary achievements across 100+ broad categories, spanning nature, compound power, science, arts, humanities, and social sectors. It's a place where exceptional individuals who challenge the limits of talent, dedication, and innovation are honored.
          <br />
          The purpose of these 100+ categories is not just to record world records, but to inspire individuals and groups to go beyond their limits and achieve something extraordinary. It is a platform that encourages creativity, knowledge, and amazing, unique and extraordinary human endeavors. It should be clearly noted that we do not encourage anyone to create records by risking their lives.
          </p>

          {/* Features */}
          <div className="about-features">
            <div className="feature-item">
              <span className="down-arrow">↙️</span> <strong>Reputation and Identity </strong>
            <p>The three stars in the URU symbol (Green, Orange, Red) represent quality, prestige and high standards. It indicates that this platform honours special merit and extraordinary work.
            </p>
            </div>
            <div className="feature-item">
              <span className="down-arrow">↙️</span> <strong>Universe and Us
              </strong>
              <p>The solar system depicted in the centre of the URU Symbol represents spiritual and scientific thinking, exploration, harmony and stability and the rainbow colours represent diversity, harmony and balance.
            </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <span className="progress-label">Success 100%</span> 
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '77%' }}></div>
            </div>
          </div>

          {/* Discover More Button */}
         <a href="/learnmore"> <button  className="discover-btn" >Learn More</button></a>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
