// GoogleMapSection.jsx
import React from "react";
import "./GoogleMapSection.css";

const GoogleMapSection = () => {
  return (
    <div className="map-container">
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093246!2d144.95373531561603!3d-37.816279442021594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577f7a749b1c8f0!2sMelbourne%20VIC%2C%20Australia!5e0!3m2!1sen!2sin!4v1617930469161!5m2!1sen!2sin"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
      <div className="address-box">
        <h3>Random Address</h3>
        <p>1234 MG Road, Bangalore, Karnataka, India</p>
      </div>
    </div>
  );
};

export default GoogleMapSection;