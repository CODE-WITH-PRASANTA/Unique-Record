import React from 'react'
import OurMission from '../../Components/OurMission/OurMission'
import './Vision.css'
import OurMainVision from '../../Components/OurMainVision/OurMainVision'
import VisionSuccessCount from '../../Components/VisionSuccessCount/VisionSuccessCount'
import MissionOfOrgansation from '../../Components/MissionOfOrgansation/MissionOfOrgansation'
import Testimonials from '../../Components/Testimonials/Testimonials'

const Vision = () => {
  return (
    <>

    <div className="Vision-section">
      <div className="Vision-content">
        <h1>
          Our Vision
        </h1>
        <p>Our Holistic Humanist Mission & Vision        </p>
      </div>
    </div>
<OurMission />
<OurMainVision />
<VisionSuccessCount />
<MissionOfOrgansation />
<Testimonials />
    </>
  )
}

export default Vision