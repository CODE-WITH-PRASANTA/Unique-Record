import React from 'react';
import './Contact.css';
import ContactForm from '../../Components/ContactForm/ContactForm';
import GoogleMapSection from '../../Components/GoogleMapSection/GoogleMapSection';
import NewsletterSection from '../../Components/NewsletterSection/NewsletterSection';

const Contact = () => {
  return (
    <>
    
    <div className="contact-section">
      <div className="contact-content">
        <h1>
          Contact Us
        </h1>
        <p>Get in touch with us</p>
      </div>
    </div>

    <ContactForm />
    <GoogleMapSection />
    <NewsletterSection />
    
    </>
  );
};

export default Contact;
