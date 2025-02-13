import React from "react";
import "./WhyChooseUs.css";
import { FaHandshake, FaHome, FaDollarSign, FaUserShield, FaTools } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const WhyChooseUs = () => {
  const cards = [
    {
      icon: <FaHandshake />,
      title: "Trusted By Thousands",
      description: "Aliquam dictum elit vitae mauris facilisis at dictum urna dignissim donec vel lectus vel felis.",
      className: "trusted",
    },
    {
      icon: <FaHome />,
      title: "Wide Range Of Properties",
      description: "Aliquam dictum elit vitae mauris facilisis at dictum urna dignissim donec vel lectus vel felis.",
      className: "properties",
    },
    {
      icon: <FaDollarSign />,
      title: "Financing Made Easy",
      description: "Aliquam dictum elit vitae mauris facilisis at dictum urna dignissim donec vel lectus vel felis.",
      className: "financing",
    },
    {
      icon: <FaUserShield />,
      title: "Secure Transactions",
      description: "Sed vel sapien eu risus tincidunt consequat. Mauris vestibulum est quis congue feugiat.",
      className: "security",
    },
    {
      icon: <FaTools />,
      title: "24/7 Customer Support",
      description: "Fusce facilisis sem at metus tristique, vel blandit magna finibus. Donec congue sapien.",
      className: "support",
    },
  ];

  return (
    <div className="about-why-choose-us">
      <h2 className="about-why-choose-us-title">
        Why <span>Choose Us</span>
      </h2>
      <p className="about-why-choose-us-subtitle">We provide full service at every step.</p>

      {/* Desktop View */}
      <div className="desktop-view">
        <div className="about-why-choose-us-cards">
          {cards.map((card, index) => (
            <div key={index} className={`card ${card.className}`}>
              <div className="icon-container">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View */}
      <div className="mobile-view">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <div className={`card ${card.className}`}>
                <div className="icon-container">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default WhyChooseUs;
