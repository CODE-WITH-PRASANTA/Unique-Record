import React from "react";
import "./MissionOfOrgansation.css";
import {
  FaLightbulb,
  FaClipboardCheck,
  FaRegHandshake,
  FaBalanceScale 
} from "react-icons/fa";
import Drawimg from "../../assets/draw-img-vision.png";

const MissionOfOrganisation = () => {
  return (
    <div className="mission-org-container">
      <div className="mission-org-content">
        <h2 className="mission-org-title">Our Mission & Vision</h2>
        <p className="mission-org-subtitle">
          We provide a trusted platform for people worldwide to showcase their
          achievements, support causes, and inspire others.
        </p>

        <div className="mission-org-items">
          {/* Vision Importance */}
          <div className="mission-org-item">
            <div className="mission-org-icon-wrapper">
              <FaLightbulb className="mission-org-icon" />
            </div>
            <div>
              <h3 className="mission-org-heading">Why is this vision important?</h3>
              <p className="mission-org-text">
              This vision is important because it reminds us that we all have the strength, intelligence, wisdom, skill, ability and passion to do something special. When we hear about the achievements of others, we definitely get inspired to do something big in our lives.
              </p>
            </div>
          </div>

          {/* Speciality of Vision */}
          <div className="mission-org-item">
            <div className="mission-org-icon-wrapper">
              <FaClipboardCheck className="mission-org-icon" />
            </div>
            <div>
              <h3 className="mission-org-heading">There is something special in this vision.!</h3>
              <p className="mission-org-text">
              The most special thing in this vision is that it talks about registering your special works or achievements in the digital archives of the universe. This is a very different, unique and exciting concept. Not only this, in future, if you add something new to those special recorded works with time or expand or expand it, then you can update the information by going to your profile with your login ID and password.
              </p>
            </div>
          </div>

          {/* Inspire Through Action */}
          <div className="mission-org-item">
            <div className="mission-org-icon-wrapper">
              <FaRegHandshake className="mission-org-icon" />
            </div>
            <div>
              <h3 className="mission-org-heading">Think about this vision!</h3>
              <p className="mission-org-text">
              If you have done or are doing something out of the box in the country, world, society, then this platform will prove to be very useful and inspiring for you. At the same time, this platform reminds us that we should never give up on our dreams and should always try to do something big, amazing, undoubtedly we will get success.
              </p>
            </div>
          </div>

          {/* Inspire Through Action */}
          <div className="mission-org-item">
            <div className="mission-org-icon-wrapper">
              <FaBalanceScale  className="mission-org-icon" />
            </div>
            <div>
              <h3 className="mission-org-heading">Because</h3>
              <p className="mission-org-text">
              No matter how much darkness the path is, if there is enough enthusiasm and courage to move forward on the path of self-confidence and positivity, then nature itself will arrange for light.
              The desire to earn a lot of name and money without doing enough hard work gives rise to crime which leads to degradation after a period of time. On the other hand, becoming famous and earning a name for amazing, unique and virtuous deeds not only provides wealth, property, fame and glory in this world but it also improves the other world and gives salvation in the next birth as well.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Image */}
      <div className="mission-org-image">
        <img src={Drawimg} alt="Mission Illustration" />
      </div>
    </div>
  );
};

export default MissionOfOrganisation;
