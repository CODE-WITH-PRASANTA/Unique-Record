import React from 'react';
import './WhoWeAre.css';

// Assets
import whoweareimg from '../../assets/who-we-are-img.jpg';

const WhoWeAre = () => {
  return (
    <section className="who-section about-agency">
      <div className="who-wrapper">
        <div className="who-image-wrapper">
          <img src={whoweareimg} alt="Who We Are" className="who-image" />
        </div>
        <div className="who-text-content">
          <p className="who-subheading">WHO WE ARE</p>
          <h2 className="who-heading">Unique Records of Universe™</h2>
          <p className="who-description">
          "Unique Records of Universe™" is a unit of Divya Prerak Kahaniyan Humanity Research Centre Trust  (DPKHRC Trust) which is created to recognize unique and extraordinary talents from around the world and to digitally record and showcase their work. We provide universal recognition to your unique records or activities. This process of registration and recognition has been developed very simple and easy. Its ideator is Dr. Avishek Kumar who is the Founder Chairman and Chief Managing Director of Divya Prerak Kahaniyan Humanity Research Centre Trust (DPKHRC Trust). He is a renowned litterateur and a great thinker, social worker and nature lover.
          </p>
          <div className="who-info-box">
            <p className="who-info-title">About URU Web Portal Development</p>
            <p className='who-info-title-content'>The web portal "Unique Records of Universe™" has been developed by Mr. Prashant Khuntia from Bhubaneswar, Odisha. The project was initiated by DPKHRC Trust, which is authorized to conduct internships through All India Council for Technical Education (AICTE) Ministry of Education, Government of India. A proposal for web development was submitted on February 15, 2025 through the AICTE internship portal with the ID INTERNSHIP_173958448267aff3e297096. 64 applicants applied. Mr. Khuntia was selected to perform this task after the interview held between March 6 and 10, 2025.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
