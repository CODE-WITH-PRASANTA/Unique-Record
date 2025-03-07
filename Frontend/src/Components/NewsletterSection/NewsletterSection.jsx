import React from "react";
import "./NewsletterSection.css";
import { FiSend } from "react-icons/fi";

const NewsletterSection = () => {
  return (
    <section className="newsletter-container">
      <div className="newsletter-wrapper">
        <h5 className="newsletter-subtitle">NEWSLETTER</h5>
        <h1 className="newsletter-title">
        You can Easily get the Latest Updates through our Communication Channels.
        </h1>
        <p className="newsletter-description">
        Subscribe to our newsletter and stay updated with the latest trends, tips and upcoming awards ceremonies to make your journey with us simpler.
        </p>
        <div className="newsletter-form">
          <input
            className="newsletter-input-field"
            type="text"
            placeholder="Enter Your Name"
          />
          <input
            className="newsletter-input-field"
            type="tel"
            placeholder="Enter Your Phone"
          />
          <input
            className="newsletter-input-field"
            type="email"
            placeholder="Enter Your Email"
          />
          <button className="newsletter-submit-btn" type="submit">
            <FiSend className="newsletter-icon" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
