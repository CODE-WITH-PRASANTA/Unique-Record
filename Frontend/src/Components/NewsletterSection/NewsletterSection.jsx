import React from "react";
import "./NewsletterSection.css";
import { FiSend } from "react-icons/fi";

const NewsletterSection = () => {
  return (
    <section className="newsletter-container">
      <div className="newsletter-wrapper">
        <h5 className="newsletter-subtitle">NEWSLETTER</h5>
        <h1 className="newsletter-title">
          Simplicity In Our Approach Without Wasting Time
        </h1>
        <p className="newsletter-description">
          Subscribe to our newsletter and stay updated with the latest trends,
          tips, and offers to simplify your journey with us.
        </p>
        <div className="newsletter-form">
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
