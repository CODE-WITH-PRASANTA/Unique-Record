import React from 'react'
import './LearnMore.css'
import LearnMoreBenifit from '../../Components/LearnMoreBenifit/LearnMoreBenifit'
import LearnMoreContent from '../../Components/LearnMoreContent/LearnMoreContent'
import LearnMoreCertificate from '../../Components/LearnMoreCertificate/LearnMoreCertificate'
import LearnMoreDigitalCertificate from '../../Components/LearnMoreDigitalCertificate/LearnMoreDigitalCertificate'
import LearnMoreLogo from '../../Components/LearnMoreLogo/LearnMoreLogo'


const LearnMore = () => {
  return (
    <>

    <div className="LearnMore-section">
      <div className="LearnMore-content">
        <h1>
           LearnMore
        </h1>
        <p>Unique Records of Universe </p>
      </div>
    </div>
    <LearnMoreBenifit />
    <LearnMoreContent />
    <LearnMoreCertificate />
    <LearnMoreDigitalCertificate />
    <LearnMoreLogo />
    </>
  )
}

export default LearnMore