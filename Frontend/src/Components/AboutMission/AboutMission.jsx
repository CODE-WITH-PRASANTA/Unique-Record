import React, { useState } from "react";
import "./AboutMission.css";
import { FaUser, FaDollarSign, FaRegPlayCircle } from "react-icons/fa";
import Rightsidemissionimg from "../../assets/mission-right-img.jpg";

const AboutMission = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleVideoOpen = () => setIsVideoOpen(true);
  const handleVideoClose = () => setIsVideoOpen(false);
  const handleToggleReadMore = () => setIsExpanded(!isExpanded);

  return (
    <div className="about-mission-container">
      {/* Mission Content Section */}
      <div className="about-mission-content">
        <h2 className="mission-title">
          About Divine<span>Grand Launch</span>
        </h2>
        <p className="mission-intro">
          The divine, grand launch of the "Unique Record of Universe™" Web Portal was done on 25 May 2025 during the Hindi-Thai Culture Mahasammelan program organized at the International forum in the capital Bangkok, Thailand. This program was organized successful with the joint effort of Devanagari Utthan Foundation, (Hyderabad, Telangana) Dharadham International (Gorakhpur, Uttar Pradesh) and DPHRC Trust (Azamgarh, Uttar Pradesh). In which more than 250 extraordinary people from government and government institutions from all over the world participated.
        </p>

        <h2 className="mission-title">
          About DPKHRC <span>Trust</span>
        </h2>

        <p className="mission-text">
          Divya Prerak Kahaniyan Humanity Research Centre is the first research institute of the country/world which is committed to establish high ideals of humanity and morality in humans along with unique and new initiatives. For world peace, progress, development, it will change the lives of people by freeing their mentality from enemies like lust, anger, pride, attachment, greed, ego, jealousy, hatred, deceit, fraud, deception etc. and will drenched them with the sweet juice of truth, love, non-violence, goodwill, cooperation and human unity, brotherhood and is an important catalytic center point for economic, social, intellectual change.
          <br />
          This research institute has the option of doing free research on more than 120 topics related to humanity in the practical world. So far, 98 researchers have registered for research on various topics of humanity through this research institute.
          <br />
          ISO 21001:2018 certified Divya Prerak Kahaniyan Humanity Research Centre was registered on 03/05/2023 at the Sub-Registrar's Office Lalganj under Azamgarh district of Uttar Pradesh state under the Indian Trust Act Law-1882. Whose registration number is- 04/36/2023. The main objective of this research center is to conduct practical research on hundreds of topics related to humanity and to establish the high values ​​of humanity.
        </p>

        {/* Read More Section */}
        <div className={`AboutMission-readmore-content ${isExpanded ? "expanded" : ""}`}>
          <p className="mission-text">
            It is known that under the banner of the brand name Divine Prerak Kahaniyan™ its foundation was laid on 01/06/2021 with two objectives of Sahitya Vidya Reading and E-Publication Center. Later, to make the writings of the authors reach the national/international level with ease and through minimal resources and efforts and to bring them fame, other services like free blog post writing and reading on hundreds of topics, ISBN (International Standard Book Number), book design, printing, copyright, Indian Language Coordination and Cooperation Council, internship, Digital Bookkeeping Management System™ (DBMS Online), accounting software and Unique Record of Universe™ were started.
            <br />
            The founder Chairman/Chief Managing Director/Chief Trustee of this Trust/Humanity Research Center is Dr. Avishek Kumar, National Writer, Bharat Sahitya Ratna awardee. Secretary- Mrs. Manju Kashyap and Treasurer- Mr. Anil.
            <br />
            With time, this research institute was registered with the Department of Micro, Small and Medium Enterprises, RRRNA and Vidyanjali Higher Education Program of the Government of India, Ministry of Education, AICTE, NITI Aayog, 80G, 12A Income Tax Department for various related recognitions and all the activities done through this trust were also copyrighted with the Government of India.
          </p>
        </div>

        {/* Read More Button */}
        <button className="AboutMission-readmore-btn" onClick={handleToggleReadMore}>
          {isExpanded ? "Read Less ▲" : "Read More ▼"}
        </button>

        {/* Mission Statistics */}
        <div className="mission-stats">
          <div className="stat-item">
            <FaUser className="stat-icon" />
            <h3>100 +</h3>
            <p>Record Category</p>
          </div>
          <div className="stat-item">
            <FaDollarSign className="stat-icon" />
            <h3>100 +</h3>
            <p>URU Post Classification</p>
          </div>
          <div className="stat-item">
            <FaDollarSign className="stat-icon" />
            <h3>900 +</h3>
            <p>Volunteers</p>
          </div>
        </div>
      </div>

      {/* Right-Side Mission Image Section */}
      <div className="about-mission-image">
        <img src={Rightsidemissionimg} alt="Mission" className="mission-image" />
        <button onClick={handleVideoOpen} className="popup_video_btn" aria-label="Play Video">
          <FaRegPlayCircle />
        </button>
      </div>

      {/* Video Modal Section */}
      {isVideoOpen && (
        <div className="video-modal">
          <div className="video-modal-content">
            <button onClick={handleVideoClose} className="close-btn">×</button>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/your-video-id"
              title="Mission Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutMission;
