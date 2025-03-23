import React from 'react'
import './OurAchivments.css'
import OurAchivmentsRecords from '../../Components/OurAchivmentsRecords/OurAchivmentsRecords'




const OurAchivments = () => {
  return (
    <>
    <div className="Achivements-section">
      <div className="Achivements-content">
        <h1>
        Achievements of Extraordinary  People
        </h1>
        <p>Unique Records & Unique Activity</p>
      </div>
    </div>
<OurAchivmentsRecords />

    </>


  )
}

export default OurAchivments