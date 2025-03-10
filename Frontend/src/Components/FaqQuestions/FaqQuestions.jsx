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
      question: ' What is the Unique Records of Universe?',
      answer: 'The Unique Records of Universe is an initiative that documents, preserves, and certifies extraordinary, inspiring, and unique events, achievements, and records occurring in the universe by individuals or groups. It includes digital documentation and recognizes exceptional talents and accomplishments worldwide.',
    },
    {
      question: ' What is the purpose of maintaining such records?',
      answer: ' The objective is to understand the diversity of various fields in the universe, preserve the unique skills, talents, and feats of extraordinary individuals, and serve as a source of inspiration for future generations.',
    },
    {
      question: ' What is the difference between Unique Records of Universe and World Book of Records?',
      answer: 'Unique Records of Universe is a modern advanced and digital concept that is a departure from the traditional World Book of Records concept. While both organizations register world records, Unique Records of Universe also records unique works or activities. The criteria, categories and verification processes of Unique Records of Universe are different and distinct from other similar organizations.',
    },
    {
      question: 'What is the process for registering a record in the Unique Records of Universe?',
      answer: 'One must visit the official website www.ouruniverse.in, create a login ID and password, and submit an online application. Supporting evidence in the form of links, files, and other documents related to the unique record or activity must be uploaded. After submission, the admin team verifies and certifies the record.',
    },
    {
      question: 'What types of achievements are recorded?',
      answer: 'The records include extraordinary performances in various fields such as sports, arts, science, technology, human achievements, literature, spirituality, and other diverse areas.',
    },
  ];

  const tourPackagesQuestions = [
   
    {
      question: 'Is there a fee for registering a record?',
      answer: ' Yes, in this Kaliyug, no one gives importance to free goods and services. Since, for maintaining your record related data on the server of the web portal for an indefinite time, you will have to pay a one-time fee of Rs. 3,693/-. If for any reason or in case of ineligibility, your record is not registered, then your payment will be refunded to the same account.',
    },
    {
      question: ' How is the record verified?',
      answer: 'Before applying, individuals should ensure that they have indeed created a unique record or performed an extraordinary activity. Independent experts and verified officials of URU examine the evidence provided by the applicant.',
    },
    {
      question: ' What benefits do record holders get?',
      answer: 'Record holders receive digital and physical certificates, media coverage, and universal recognition.',
    },
    {
      question: ' Do record holders receive any awards?',
      answer: 'In some cases, special awards or honors are given during events organized in different states. Additionally, awards and recognition materials may be sent to their homes via post.',
    },
    {
      question: ' What is the process for breaking a record?',
      answer: 'It involves presenting new evidence and undergoing the verification process again.',
    },
    {
      question: ' Can a record be challenged?',
      answer: ' Yes, if new evidence is submitted that disproves an existing record, it can be modified or annulled accordingly.',
    },
  ];

  const managingQuestionstwo = [
    {
      question: 'Where is the headquarters of Unique Records of Universe located?',
      answer: 'It is a unit of DPKHRC Trust, with its registered office in Thekma, Azamgarh district, Uttar Pradesh, India. Additional offices are located in Aurangabad, Bihar, and Una, Himachal Pradesh.',
    },
    {
      question: ' Does the Unique Records of Universe have regional offices?',
      answer: 'Yes, regional offices are being established in various countries and states across India.',
    },
    {
      question: 'Does the Unique Records of Universe have an official website?',
      answer: 'Yes, its official website is www.ouruniverse.in, where more information on record registration and application processes can be found.',
    },
    {
      question: ' Does the Unique Records of Universe publish an annual book?',
      answer: 'Not currently. Since it is a digital initiative, all new and old records are available on the website in a date-wise manner, accessible anytime from anywhere. However, an annual publication may be considered in the future if necessary.',
    },
    {
      question: 'Does the Unique Records of Universe organize events?',
      answer: 'Yes, various events are held to honor record holders and establish new records.',
    },
    {
      question: 'Does the Unique Records of Universe have social media accounts?',
      answer: 'Yes, it is active on social media platforms such as Facebook, WhatsApp, Instagram, YouTube, X (formerly Twitter), etc.',
    },
    
  ];

  const tourPackagesQuestionstwo = [
  
    {
      question: ' Can the Unique Records of Universe be viewed online?',
      answer: 'Yes, the records can be viewed on its official website and social media platforms.',
    },
    {
      question: ' Can partnerships be formed with the Unique Records of Universe for events?',
      answer: 'Yes, various organizations and individuals can partner in organized events and also become sponsors.',
    },
    {
      question: ' Can the records and activities of the Unique Records of Universe be used in education?',
      answer: 'Yes, they can inspire students and enhance knowledge.',
    },
    {
      question: 'Can the records and achievements of the Unique Records of Universe be used for commercial purposes?',
      answer: 'In some cases, they can be used with proper licensing and permissions.',
    },
    {
      question: 'What is the significance of the numbers 3, 6, and 9 in the registration fee and certificate number?',
      answer: 'The deep secret of the universe is hidden in the 3, 6, 9 digits. Along with being powerful, these numbers are the key to the universe. This number occupies an important place in mathematics, science, astrology and spirituality. If you want to understand the mystery of the universe, think about energy, frequency and vibrations. If you understand the secret of 3, 6 and 9, you will get the key to the universe. You can get more information in this context from the literature of Vedas, Puranas, Shastras, Upanishads and the great scientist Nikola Tesla.',
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
          <h2>How are Records Registered?          </h2>
          {renderQuestions(managingQuestions, activeQuestions.general, 'general')}
        </div>
        <div className="faq-questions-category">
          <h2>What do Record Holders Receive?
          </h2>
          {renderQuestions(tourPackagesQuestions, activeQuestions.booking, 'booking')}
        </div>
      </div>
    <div className="second-question-section">
      <div className="faq-questions-section ">
        <div className="faq-questions-category">
          <h2>Breaking a Record</h2>
          {renderQuestions(managingQuestionstwo, activeQuestions.tour, 'tour')}
        </div>
        <div className="faq-questions-category">
          <h2>Breaking a Record </h2>
          {renderQuestions(tourPackagesQuestionstwo, activeQuestions.package, 'package')}
        </div>
      </div>
      </div>
    </div>

   </>
  );
};

export default FaqQuestion;
