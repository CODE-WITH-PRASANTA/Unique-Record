import React from "react";
import { Link } from "react-router-dom";
import "./Notice.css";
import NoticeContent from "../../Components/NoticeContent/NoticeContent";

const Notice = () => {
  return (
    <div className="notice-page-container">
      <div className="Notice-section">
        <div className="Notice-overlay"></div>
        <div className="Notice-content">
          <p className="sanskrit-text">अक्षरम परमं ब्रह्म ज्योति रूपम सनातनम्</p>
          <h1>
            Official <span>Notices</span> & Circulars
          </h1>
          <p>
            Stay updated with the latest declarations, guidelines, and event announcements from Unique Records of the Universe.
          </p>
        </div>

        <div className="notice-breadcrumb">
          <Link to="/">Home</Link>
          <span className="separator">/</span>
          <span className="current">Notice Board</span>
        </div>
      </div>

      <NoticeContent />
    </div>
  );
};

export default Notice;