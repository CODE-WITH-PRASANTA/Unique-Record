import React from "react";
import "./WhyChooseUs.css";

// Assets
import rightsideimg from "../../assets/why-choose-one-img-1.jpg";
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
              <h3>Highest Success Rates</h3>
              <p>We ensure exceptional growth with expert strategies and innovative solutions.</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="feature">
            <div className="why-icon"><FaCheck /></div>
            <div className="text">
              <h3>We Grow Businesses</h3>
              <p>Unlock your potential with tailored financial plans and market insights.</p>
            </div>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="right-content">
          <div className="experience-box">
            <div className="experience-text">
              <div className="people-why-icon"><FaUsers /></div>
              <p>We’ve Over 26 Years of Experience</p>
            </div>
          </div>
          <img src={rightsideimg} alt="Experience Team" className="rightside-img" />
        </div>
      </div>

      {/* Business Steps Section */}
      <div className="business-steps">
        <div className="tab-buttons">
          <div className="tab-btn tab-black"><span>Business Growth</span></div>
          <div className="tab-btn tab-white"><span>Financial Advice</span></div>
          <div className="tab-btn tab-yellow"><span>Marketing Solution</span></div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
