import React from 'react'
import './OurAchivments.css'
import OurAchivmentsRecords from '../../Components/OurAchivmentsRecords/OurAchivmentsRecords'




const OurAchivments = () => {
  return (
    <>
    <div className="Achivements-section">
      <div className="Achivements-content">
        <h1>
          Our Achivements
        </h1>
        <p>Our Mission & Achivements </p>
      </div>
    </div>
<OurAchivmentsRecords />

    </>


  )
}

export default OurAchivments