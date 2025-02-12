import React from 'react';
import './FreeQuotes.css';

// Assets 
import rightShape from '../../assets/contact-shape-3.png';
import leftImage from '../../assets/contact-img-1.jpg';

const FreeQuotes = () => {
  return (
    <div className="free-quotes-container">
      {/* Left Section */}
      <div className="free-quotes-left">
        <img 
          src={leftImage} 
          alt="Team collaboration" 
          className="free-quotes-image"
        />
      </div>

      {/* Right Section */}
      <div className="free-quotes-right" style={{ backgroundImage: `url(${rightShape})` }}>
        <div className="free-quotes-content">
          <p className="free-quotes-title">🟡Contact Us🟡</p>
          <h2 className="free-quotes-heading">Get a Free Advice</h2>

          <form className="free-quotes-form">
            <div className="free-quotes-row">
              <input 
                type="text" 
                placeholder="Your name" 
                className="free-quotes-input"
              />
              <input 
                type="email" 
                placeholder="Email address" 
                className="free-quotes-input"
              />
            </div>
            <div className="free-quotes-row">
              <input 
                type="tel" 
                placeholder="Phone" 
                className="free-quotes-input"
              />
            </div>
            <textarea 
              placeholder="Write a message" 
              className="free-quotes-textarea"
            ></textarea>
            <button type="submit" className="free-quotes-button">
              Send a Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FreeQuotes;