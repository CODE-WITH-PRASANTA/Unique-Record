import React from "react";
import "./About.css";
import WhoWeAre from "../../Components/WhoWeAre/WhoWeAre";
import AboutMission from "../../Components/AboutMission/AboutMission";
import WhyChooseUs from "../../Components/WhyChooseUs/WhyChooseUs";
import ClientFeedBack from "../../Components/ClientsFeedback/ClientsFeedBack";
import MeetOurAgent from "../../Components/MeetOurAgent/MeetOurAgent";

const AboutUs = () => {

  return (
    <>
      <div className="section-about-heading-section">
        <div className="section-about-content">
          <div className="badge">A digital archive of unique achievements, an endless source of inspiration. </div>
          <h1 className="about-heading">Be Part of the Digital Documentation Revolution of Extraordinary Achievements! </h1>
          <p className="main-about-description">
          Every unique work gets a unique recognition. Prove yourself, inspire the world.
          </p>
          <button className="start-btn" >
            Start your journey
          </button>
        </div>
      </div>

      <WhoWeAre />
      <AboutMission />
      <WhyChooseUs />
      <MeetOurAgent />
      <ClientFeedBack />
    </>
  );
};

export default AboutUs;
