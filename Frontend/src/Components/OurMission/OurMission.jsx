import React from "react";
import "./OurMission.css";
import {
  FaTint,
  FaAppleAlt,
  FaGraduationCap,
  FaHeartbeat,
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
      icon: <FaTint className="mission-icon" />,
      title: "Clean Water",
      description: "An organization’s mission statement should clearly communicate",
    },
    {
      icon: <FaAppleAlt className="mission-icon" />,
      title: "Healthy Food",
      description: "An organization’s mission statement should clearly communicate",
    },
    {
      icon: <FaGraduationCap className="mission-icon" />,
      title: "Free Education",
      description: "An organization’s mission statement should clearly communicate",
    },
    {
      icon: <FaHeartbeat className="mission-icon" />,
      title: "Medical Facilities",
      description: "An organization’s mission statement should clearly communicate",
    },
  ];

  return (
    <section className="mission-section">
      <div className="mission-container">
        <div className="mission-header">
          <h4>WHAT WE DO?</h4>
          <h2>
            <FaQuoteLeft className="quote-icon left" />
            We Are In A Mission To Help The Helpless
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
