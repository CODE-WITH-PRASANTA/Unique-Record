import React, { useEffect, useRef, useState } from 'react';
import './HomeAbout.css';

// Assets
import aboutoneimg from '../../assets/about-one-img-1.jpg';
import abouttwoimg from '../../assets/about-one-img-2.jpg';

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
          <h2 className="about-title">Digital Marked as a  URU Holder</h2>
          <p className="about-highlight">
          We Reflect the Spirit of Connecting Different Cultures, Beliefs and Abilities.
          </p>
          <p className="about-description">
          It is a symbol of extraordinary achievement, diversity, inclusiveness and universal unity, and an important link in the universe that will inspire others.
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
              <div className="progress-fill" style={{ width: '100%' }}></div>
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
