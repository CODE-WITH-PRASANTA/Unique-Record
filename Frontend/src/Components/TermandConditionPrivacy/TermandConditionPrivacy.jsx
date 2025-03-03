import React from 'react';
import './TermandConditionPrivacy.css';

const TermandConditionPrivacy = () => {
  return (
    <div className="privacy-wrapper">
      <div className="privacy-container">
        <h1 className="privacy-title">Privacy Policy</h1>

        <section className="privacy-section">
          <p className="privacy-intro">
            This privacy policy explains how <strong>DIVYA PRERAK KAHANIYAN HUMANITY RESEARCH CENTRE TRUST</strong> collects, uses, and protects any information that you provide while visiting our website or purchasing from us.
          </p>
          <p className="privacy-statement">
            We are committed to ensuring that your privacy is protected. If we ask for any personal information, rest assured that it will only be used in accordance with this policy.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">Information We Collect</h2>
          <ul className="privacy-list">
            <li>Full Name</li>
            <li>Contact details including email address and phone number</li>
            <li>Demographic details such as location, preferences, and interests</li>
            <li>Other information relevant to surveys or offers</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">How We Use This Information</h2>
          <ul className="privacy-list">
            <li>For internal record keeping</li>
            <li>To improve our products and services</li>
            <li>To send promotional emails regarding new products or special offers</li>
            <li>For market research purposes, via email, phone, or mail</li>
            <li>To personalize and enhance your website experience</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">Security</h2>
          <p className="privacy-text">
            We are committed to securing your personal information. We implement appropriate safeguards to prevent unauthorized access or disclosure.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">Use of Cookies</h2>
          <p className="privacy-text">
            Cookies are small files that enhance user experience by analyzing website traffic and preferences. They help customize the website according to individual user needs.
          </p>
          <p className="privacy-text">
            We use traffic log cookies to identify popular pages and improve website functionality. This data is used for analysis and is removed after use.
          </p>
          <p className="privacy-text">
            You can modify your browser settings to decline cookies, but this may limit website functionality.
          </p>
        </section>

        <section className="privacy-section">
          <h2 className="privacy-heading">Managing Your Personal Information</h2>
          <p className="privacy-text">
            You may restrict the collection and use of your personal data by opting out of marketing communications through provided options or by contacting us.
          </p>
          <p className="privacy-contact"><strong>Email:</strong> uruonline2025@gmail.com</p>
          <p className="privacy-contact"><strong>Address:</strong> Village+Post- Thekma, District- Azamgarh, Uttar Pradesh, Pin-276303, India</p>
          <p className="privacy-contact"><strong>Phone:</strong> +91 9472351693</p>
        </section>
      </div>
    </div>
  );
};

export default TermandConditionPrivacy;
