import React from 'react'
import './AchiverDetails.css'
import AchiverSection from '../../Components/AchiverSection/AchiverSection'



const AchiverDetails = () => {
  return (
    <div>
<div className="Achiver-Details-section">
      <div className="Achiver-Details-content">
        <h1>
        Achiver's Details
        </h1>
        <p>Unique Records & Unique Activity</p>
      </div>
    </div>

    <AchiverSection />
    </div>
  )
}

export default AchiverDetails