import React from "react";
import "./WhyChooseUs.css";

// Assets
import rightsideimg from "../../assets/why-choose-one-img-1.jpeg";
import { FaCheck } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";

const WhyChooseUs = () => {
  return (
    <section className="why-choose-us">
      <div className="why-container">
        {/* Left Side Content */}
        <div className="left-content">
          <div className="feature">
            <div className="why-icon"><FaCheck /></div>
            <div className="text">
              <h3>A new Dimension of Success</h3>
              <p>A symbol of inspiration, certification, recognition and celebration. A confluence of the world's unique, rare talents.</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="feature">
            <div className="why-icon"><FaCheck /></div>
            <div className="text">
              <h3>Universal Recognition of Exceptional Work</h3>
              <p>Make your mark digitally in the digital age. Immortalize your amazing, unique work in the digital our universe</p>
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="right-content">
          <div className="experience-box">
            <div className="experience-text">
              <div className="people-why-icon"><FaUsers /></div>
              <p>Our Years-old Experienced Team is Ready to Help You.</p>
            </div>
          </div>
          <img src={rightsideimg} alt="Experience Team" className="rightside-img" />
        </div>
      </div>

      {/* Business Steps Section */}
      <div className="business-steps">
        <div className="tab-buttons">
          <div className="tab-btn tab-black"><span>Unique Work</span></div>
          <div className="tab-btn tab-white"><span>Dedication & Famous </span></div>
          <div className="tab-btn tab-yellow"><span>Prosperity</span></div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
