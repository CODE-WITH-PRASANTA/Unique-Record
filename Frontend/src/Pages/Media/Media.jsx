import React from 'react'
import './Media.css'
import MediaGalary from '../../Components/MediaGalary/MediaGalary'



const Media = () => {
  return (
    <>
  <div className="Media-section">
      <div className="Media-content">
        <h1>
          Media Galary
        </h1>
        <p>Photos & Videos Of Our Progress </p>
      </div>
  </div>

    <MediaGalary />

    </>
  )
}

export default Media