import React from "react";
import "./LearnMoreDigitalCertificate.css";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaUser, // Certificate Holder's Name
  FaListAlt, // Category
  FaTrophy, // Type of Record
  FaCalendarAlt, // Digitization Date
  FaFingerprint, // Unique ID
  FaQrcode // QR Code
} from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";

const LearnMoreDigitalCertificate = () => {
  const missionItems = [
    {
      icon: <FaUser className="LearnMore-DigitalCertificate-icon" />, // Certificate Holder's Name
      title: "Certificate Holder's Name",
      description: "This is the name of the person who created the world record.",
    },
    {
      icon: <FaListAlt className="LearnMore-DigitalCertificate-icon" />, // Category
      title: "Category",
      description: "This is the name of the category in which the world record was created",
    },
    {
      icon: <FaTrophy className="LearnMore-DigitalCertificate-icon" />, // Type of Record
      title: "Type of Record",
      description: "This is the type of specific record that was created",
    },
    {
      icon: <FaCalendarAlt className="LearnMore-DigitalCertificate-icon" />, // Digitization Date
      title: "Digitization Date",
      description: "The date is marked when the certificate was digitized.",
    },
    {
      icon: <FaFingerprint className="LearnMore-DigitalCertificate-icon" />, // Unique ID
      title: "Unique ID",
      description: "The certificate also has a unique identification number",
    },
    {
      icon: <FaQrcode className="LearnMore-DigitalCertificate-icon" />, // QR Code
      title: "QR Code",
      description: "By scanning this code, the authenticity of the certificate and other details, given evidence documents, links etc. can be viewed and verified",
    },
  ];

  return (
    <section className="LearnMore-DigitalCertificate-section">
      <div className="LearnMore-DigitalCertificate-container">
        <div className="LearnMore-DigitalCertificate-header">
          <h4>Format of Digital Certificate</h4>
          <h2>
            <FaQuoteLeft className="quote-icon left" />
            The digital certificate issued by Unique Records of Universe contains the following information
            <FaQuoteRight className="quote-icon right" />
          </h2>
        </div>

        {/* Desktop View: Grid Layout */}
        <div className="LearnMore-DigitalCertificate-grid">
          {missionItems.map((item, index) => (
            <div key={index} className="LearnMore-DigitalCertificate-card">
              <div className="icon-wrapper">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile View: Swiper */}
        <div className="LearnMore-DigitalCertificate-swiper">
          <Swiper
            modules={[Pagination]}
            spaceBetween={20}
            slidesPerView={1.2}
            pagination={{ clickable: true }}
          >
            {missionItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="LearnMore-DigitalCertificate-card">
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

export default LearnMoreDigitalCertificate;