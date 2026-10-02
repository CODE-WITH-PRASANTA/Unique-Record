import React from 'react';
import { Link } from 'react-router-dom';
import './OurAchivments.css';
import OurAchivmentsRecords from '../../Components/OurAchivmentsRecords/OurAchivmentsRecords';

const OurAchivments = () => {
  return (
    <div className="achievements-page">
      {/* HERO BANNER SECTION */}
      <div className="Achivments-section">
        <div className="Achivments-overlay" />
        <div className="Achivments-content">
          <p className="sanskrit-text">अक्षरम परमं ब्रह्म ज्योति रूपम सनातनम्</p>
          <h1>
            Achievements of <span>Extraordinary</span> People
          </h1>
          <p className="Achivments-tagline">Unique Records & Unique Activity</p>
        </div>

        <div className="achievements-breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="current">Achievements</span>
        </div>
      </div>

      {/* ACHIEVEMENTS CONTENT SECTION */}
      <div className="achievements-body">
        <OurAchivmentsRecords />
      </div>
    </div>
  );
};

export default OurAchivments;