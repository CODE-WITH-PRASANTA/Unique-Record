import React from "react";
import "./LearnMoreCertificate.css";
import {
  FaLightbulb,
  FaClipboardCheck,
  FaRegHandshake,
} from "react-icons/fa";
import Drawimg from "../../assets/draw-img-vision.png";

const LearnMoreCertificate = () => {
  return (
    <div className="LearnMore-Certificate-container">
      <div className="LearnMore-Certificate-content">
        <h2 className="LearnMore-Certificate-title"> Our Inovation & Celebration</h2>
        <p className="LearnMore-Certificate-subtitle">
        Unique Records of Universe is a Celebration
        </p>

        <div className="LearnMore-Certificate-items">
          {/* Vision Importance */}
          <div className="LearnMore-Certificate-item">
            <div className="LearnMore-Certificate-icon-wrapper">
              <FaLightbulb className="LearnMore-Certificate-icon" />
            </div>
            <div>
              <h3 className="LearnMore-Certificate-heading">Unique Records of Universe is a Celebration</h3>
              <p className="LearnMore-Certificate-text">
              A celebration of human potential, creativity, and determination. It is a reminder that we all have something special, something that can change the world. It is an inspiration– to challenge your limits, to pursue your dreams, and to achieve something that has never been done before. If you do something positive and unique, our team will go to the spot to encourage and reward you.
              </p>
            </div>
          </div>

          {/* Speciality of Vision */}
          <div className="LearnMore-Certificate-item">
            <div className="LearnMore-Certificate-icon-wrapper">
              <FaClipboardCheck className="LearnMore-Certificate-icon" />
            </div>
            <div>
              <h3 className="LearnMore-Certificate-heading">Innovation of Digital Certificate</h3>
              <p className="LearnMore-Certificate-text">
              Unique Records of Universe is a platform that recognizes unique, one-of-a-kind and extraordinary achievements in 100+ different fields. This platform records world/universe records in 100+ broad categories, spanning nature, science, arts, humanities and social sectors.
              Unique Records of Universe has introduced a new innovation sample- the digital certificate of the World/Universe holder. This certificate is provided to individuals who have created a World/Universe record in Unique Records of Universe.
              </p>
            </div>
          </div>

          {/* Inspire Through Action */}
          <div className="LearnMore-Certificate-item">
            <div className="LearnMore-Certificate-icon-wrapper">
              <FaRegHandshake className="LearnMore-Certificate-icon" />
            </div>
            <div>
              <h3 className="LearnMore-Certificate-heading">Importance of Digital Certificate</h3>
              <p className="LearnMore-Certificate-text">
              The digital certificate introduced by Unique Records of Universe is an important innovation. It not only provides recognition to the World/Universe record holders for their achievements, but also helps them to manage their certificates in a safe and convenient way.
            These digital certificates are recognized globally, which is an additional benefit for World/Universe record holders.
              </p>
            </div>
          </div>

              {/* Speciality of Vision */}
              <div className="LearnMore-Certificate-item">
            <div className="LearnMore-Certificate-icon-wrapper">
              <FaClipboardCheck className="LearnMore-Certificate-icon" />
            </div>
            <div>
              <h3 className="LearnMore-Certificate-heading">Conclusion of Digital Certificate</h3>
              <p className="LearnMore-Certificate-text">
              The Digital Certificate introduced by Unique Records of Universe is a welcome step. This innovation will definitely help world record holders to celebrate their achievements and share them with the world.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side Image */}
      <div className="LearnMore-Certificate-image">
        <img src={Drawimg} alt="Mission Illustration" />
      </div>
    </div>
  );
};

export default LearnMoreCertificate;
