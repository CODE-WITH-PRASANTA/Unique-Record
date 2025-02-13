import React from "react";
import "./About.css";
import WhoWeAre from "../../Components/WhoWeAre/WhoWeAre";
import AboutMission from "../../Components/AboutMission/AboutMission";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import AboutAgent from "../../Components/AboutAgent/AboutAgent";
import ClientFeedBack from "../../Components/ClientsFeedback/ClientsFeedBack";

const AboutUs = () => {

  return (
    <>
      <div className="section-about-heading-section">
        <div className="section-about-content">
          <div className="badge">Digitally Marking The Extraordinary Achievement</div>
          <h1 className="about-heading">Find Your Perfect Program</h1>
          <p className="about-description">
            We'll help you find and get into the perfect program in your dream
            destination.
          </p>
          <button className="start-btn" >
            Start your journey
          </button>
        </div>
      </div>

      <WhoWeAre />
      <AboutMission />
      <WhyChooseUs />
      <AboutAgent />
      <ClientFeedBack />
    </>
  );
};

export default AboutUs;
