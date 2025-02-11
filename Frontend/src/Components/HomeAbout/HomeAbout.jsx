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
            <p className="certified-text">📜 Certified Digital Marketing</p>
          </div>
        </div>

        {/* Right Side with Text */}
        <div className="about-content">
          <p className="about-subtitle">🟡🟡🟡 GET TO KNOW US</p>
          <h2 className="about-title">The Best Agency in Downtown</h2>
          <p className="about-highlight">
            We’re Committed to Deliver High Quality Projects
          </p>
          <p className="about-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>

          {/* Features */}
          <div className="about-features">
            <div className="feature-item">
              <span className="down-arrow">↙️</span> <strong>Design Freedom</strong>
              <p>Lorem ipsum dolor sit notted consectetur.</p>
            </div>
            <div className="feature-item">
              <span className="down-arrow">↙️</span> <strong>Marketing Rules</strong>
              <p>Lorem ipsum dolor sit notted consectetur.</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <span className="progress-label">Success 89%</span> 
            <div className="progress-track">
              <div className="progress-fill" style={{ width: '77%' }}></div>
            </div>
          </div>

          {/* Discover More Button */}
          <button className="discover-btn">Discover More</button>
        </div>
      </div>
    </div>
  );
};

export default HomeAbout;
