import React from "react";
import "./OurMission.css";
import {
  FaLightbulb,
  FaBuilding,
  FaGlobe,
  FaRoad,
  FaQuoteLeft,
  FaQuoteRight,
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const OurMission = () => {
  const missionItems = [
    {
      icon: <FaLightbulb className="mission-icon" />, // Represents inspiration
      title: "Flame of inspiration",
      description: "Light the lamp of inspiration, shine with your unique achievements",
    },
    {
      icon: <FaBuilding className="mission-icon" />, // Represents foundation
      title: "Foundation of Excellence",
      description: "Honoring unique works, building future generations",
    },
    {
      icon: <FaGlobe className="mission-icon" />, // Represents universal recognition
      title: "Cosmic Recognition",
      description: "The Unique Record of Universe, witness to your achievements",
    },
    {
      icon: <FaRoad className="mission-icon" />, // Represents the path to success
      title: "Path to Success",
      description: "On the road to success, Unique Record of Universe is with you",
    },
  ];

  return (
    <section className="mission-section">
      <div className="mission-container">
        <div className="mission-header">
          <h4>WHAT WE DO?</h4>
          <h2>
            <FaQuoteLeft className="quote-icon left" />
            Your Hard Work, Your Identity, Recorded in the Unique Record of Universe.
            <FaQuoteRight className="quote-icon right" />
          </h2>
        </div>

        {/* Desktop View: Grid Layout */}
        <div className="mission-grid">
          {missionItems.map((item, index) => (
            <div key={index} className="mission-card">
              <div className="icon-wrapper">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile View: Swiper */}
        <div className="mission-swiper">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            pagination={{ clickable: true }}
          >
            {missionItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="mission-card">
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

export default OurMission;