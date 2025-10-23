import React from "react";
import "./LearnMoreBenifit.css";
import {
  FaLightbulb,
  FaBuilding,
  FaGlobe,
  FaRoad,
  FaQuoteLeft, 
  FaQuoteRight,
  FaShieldAlt, // Security icon
  FaClock, // Durability icon
  FaShareAlt, // Convenience icon
  FaGlobeAmericas // Global Recognition icon
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const LearnMoreBenifit = () => {
  const missionItems = [
    
    {
      icon: <FaShieldAlt className="LearnMore-Benifit-icon" />, // Security
      title: "Security",
      description: "Digital certificates are secure and difficult to forge",
    },
    {
      icon: <FaClock className="LearnMore-Benifit-icon" />, // Durability
      title: "Durability",
      description: "Digital certificates are infinitely more durable than physical certificates",
    },
    {
      icon: <FaShareAlt className="LearnMore-Benifit-icon" />, // Convenience
      title: "Convenience",
      description: "Digital certificates can be easily shared and stored",
    },
    {
      icon: <FaGlobeAmericas className="LearnMore-Benifit-icon" />, // Global Recognition
      title: "Global Recognition",
      description: "In today's time digital is being promoted all over the world including India. Therefore, digital certificates are recognized all over the world",
    },
  ];

  return (
    <section className="LearnMore-Benifit-section">
      <div className="LearnMore-Benifit-container">
        <div className="LearnMore-Benifit-header">
          <h4>WHAT's the Benifits ?</h4>
          <h2>
            <FaQuoteLeft className="quote-icon left" />
            In addition, certificates etc. in physical form will also be sent to their postal address given to the URU holder.
            <FaQuoteRight className="quote-icon right" />
          </h2>
        </div>

        {/* Desktop View: Grid Layout */}
        <div className="LearnMore-Benifit-grid">
          {missionItems.map((item, index) => (
            <div key={index} className="LearnMore-Benifit-card">
              <div className="icon-wrapper">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile View: Swiper */}
        <div className="LearnMore-Benifit-swiper">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            pagination={{ clickable: true }}
          >
            {missionItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="LearnMore-Benifit-card">
                  <div className="icon-wrapper">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default LearnMoreBenifit;
