import React from 'react'
import './FaqPage.css'
import FaqQuestion from '../../Components/FaqQuestions/FaqQuestions'
import MainContactForm from '../../Components/MainContactFrom/MainContactForm'

const FaqPage = () => {
  return (
    <>

    <div className="faq-section">
      <div className="faq-content">
        <h1>
          Faq
        </h1>
        <p>Frequently Asked Questions</p>
      </div>
    </div>

    <FaqQuestion />
    <MainContactForm />
    </>
  )
}

export default FaqPage