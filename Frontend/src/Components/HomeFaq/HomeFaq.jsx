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
      question: "What is the Unique Records of Universe?", 
      answer: "The Unique Records of Universe is an initiative that documents, preserves, and certifies extraordinary, inspiring, and unique events, achievements, and records occurring in the universe by individuals or groups. It includes digital documentation and recognizes exceptional talents and accomplishments worldwide." 
    },
    { 
      question: "What is the purpose of maintaining such records?", 
      answer: "The objective is to understand the diversity of various fields in the universe, preserve the unique skills, talents, and feats of extraordinary individuals, and serve as a source of inspiration for future generations." 
    },
    { 
      question: "What is the difference between Unique Records of Universe and World Book of Records?", 
      answer: "Unique Records of Universe is a modern advanced and digital concept that is a departure from the traditional World Book of Records concept. While both organizations register world records, Unique Records of Universe also records unique works or activities. The criteria, categories and verification processes of Unique Records of Universe are different and distinct from other similar organizations." 
    },
    { 
      question: "What is the process for registering a record in the Unique Records of Universe?", 
      answer: " One must visit the official website www.ouruniverse.in, create a login ID and password, and submit an online application. Supporting evidence in the form of links, files, and other documents related to the unique record or activity must be uploaded. After submission, the admin team verifies and certifies the record." 
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
            <li>Globally recognized record-keeping platform</li>
            <li>Dedicated support team available 24/7</li>
            <li>Transparent and seamless registration process</li>
            <li>Celebrating unique talents and achievements worldwide</li>
            <li>Trusted by thousands of record holders</li>
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
              <div className="home-faq-answer" style={{ maxHeight: openIndex === index ? "200px" : "0px" }}>
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
