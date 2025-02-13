import React, { useState } from 'react';
import './FaqQuestions.css';


const FaqQuestion = () => {
  // Separate state for each category to track the active question
  const [activeQuestions, setActiveQuestions] = useState({
    general: null,
    booking: null,
    tour: null,
    package: null,
  });

  // Generic toggle function to handle different categories
  const toggleQuestion = (category, index) => {
    setActiveQuestions((prevState) => ({
      ...prevState,
      [category]: prevState[category] === index ? null : index,
    }));
  };

  const managingQuestions = [
    {
      question: 'What types of aircraft are available?',
      answer: 'VIP Jets offers a wide variety of aircraft for groups of all sizes. With the VIP Jets 25-Hour Card, you can choose the size and age class.',
    },
    {
      question: 'How many people do they hold?',
      answer: 'Our aircraft can accommodate groups ranging from 4 to 30 passengers, depending on the model.',
    },
    {
      question: 'Can I use more than one of your aircraft at a time?',
      answer: 'Yes, we offer multi-aircraft options for larger groups or simultaneous flights.',
    },
    {
      question: 'Where can I fly on one of your private jets?',
      answer: 'Our private jets can take you to most destinations worldwide, subject to flight regulations and availability.',
    },
  ];

  const tourPackagesQuestions = [
    {
      question: 'How do I book a flight?',
      answer: 'You can book a flight through our website or by contacting our customer support team.',
    },
    {
      question: 'What is the cancellation policy?',
      answer: 'Cancellations are subject to terms outlined in your booking agreement. Contact support for details.',
    },
    {
      question: 'Can I change my flight details?',
      answer: 'Yes, changes can be made, subject to availability and applicable fees.',
    },
    {
      question: 'Where can I fly on one of your private jets?',
      answer: 'VIP Jets offers a variety of aircraft suited for all group sizes, giving you the flexibility to choose the size and age class.',
    },
  ];

  const renderQuestions = (questions, activeIndex, category) => {
    return questions.map((item, index) => (
      <div key={index} className={`faq-questions-item ${activeIndex === index ? 'active' : ''}`}>
        <div
          className={`faq-questions-question ${activeIndex === index ? 'active' : ''}`}
          onClick={() => toggleQuestion(category, index)}
        >
          {index + 1}. {item.question}
        </div>
        <div className="faq-questions-answer">
          {activeIndex === index && <p>{item.answer}</p>}
        </div>
      </div>
    ));
  };

  return (
    <>

    <div className="faq-questions-section-wrapper">
      <div className="faq-questions-section">
        <div className="faq-questions-category">
          <h2>General Questions</h2>
          {renderQuestions(managingQuestions, activeQuestions.general, 'general')}
        </div>
        <div className="faq-questions-category">
          <h2>Managing Your Deals</h2>
          {renderQuestions(tourPackagesQuestions, activeQuestions.booking, 'booking')}
        </div>
      </div>
    <div className="second-question-section">
      <div className="faq-questions-section ">
        <div className="faq-questions-category">
          <h2>Main Questions</h2>
          {renderQuestions(managingQuestions, activeQuestions.tour, 'tour')}
        </div>
        <div className="faq-questions-category">
          <h2>Managing Your Everything</h2>
          {renderQuestions(tourPackagesQuestions, activeQuestions.package, 'package')}
        </div>
      </div>
      </div>
    </div>

   </>
  );
};

export default FaqQuestion;
