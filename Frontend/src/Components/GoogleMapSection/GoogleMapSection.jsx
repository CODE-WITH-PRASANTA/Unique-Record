import React from "react";
import "./GoogleMapSection.css";

const GoogleMapSection = () => {
  return (
    <div className="map-container">
      <iframe
        title="Google Map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28864.805381162935!2d83.2348!3d26.0933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991863091b8b3b1%3A0x5b9c9e6e64b2d5d0!2sLalganj%2C%20Uttar%20Pradesh%20276303!5e0!3m2!1sen!2sin!4v1617930469161!5m2!1sen!2sin"
        width="600"
        height="450"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
      ></iframe>
      <div className="address-box">
        <h3>Regd. Office  Address</h3>
        <p>Thekma, District- Azamgarh, Uttar Pradesh, India, Pin- 27630</p>
      </div>
    </div>
  );
};

export default GoogleMapSection;
