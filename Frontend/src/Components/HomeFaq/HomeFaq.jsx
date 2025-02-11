import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // Importing icons
import "./HomeFaq.css"; // Import CSS

const HomeFaq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    { 
      question: "What is Digital Marketing Services?", 
      answer: "Digital marketing services include SEO, social media, and paid ads to promote businesses online." 
    },
    { 
      question: "What are the Benefits of Large Scale Marketing?", 
      answer: "Large-scale marketing reaches a broader audience, increasing brand awareness and potential sales." 
    },
    { 
      question: "What should we do if sales are decreasing?", 
      answer: "Analyze data, adjust strategies, and improve customer engagement to boost sales." 
    },
    { 
      question: "Which services are required to build a website?", 
      answer: "Services include domain registration, web design, development, hosting, and SEO." 
    },
  ];

  return (
    <div className="full-faq-sec">
      <div className="faq-container">
        {/* Left Section */}
        <div className="faq-left">
          <p className="faq-subtitle"> 🟡🟡🟡 Frequently Asked Questions 🟡🟡🟡</p>
          <h2 className="faq-title">Questions & Answers</h2>
          <p className="faq-description">
            Need help? Find quick answers to common questions below.
          </p>
          <ul className="faq-list">
            <li> High-quality marketing solutions</li>
            <li> 24/7 customer support</li>
            <li> Affordable pricing</li>
            <li> Proven success in digital marketing</li>
            <li> Trusted by 10,000+ clients</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="faq-right">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span className="faq-toggle">
                  {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>
              <div className="faq-answer" style={{ maxHeight: openIndex === index ? "100px" : "0px" }}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFaq;
