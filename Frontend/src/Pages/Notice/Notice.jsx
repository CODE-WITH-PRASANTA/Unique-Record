import React from 'react'
import './Notice.css'
import NoticeContent from '../../Components/NoticeContent/NoticeContent'

const Notice = () => {
  return (
    <div>
         <div className="Notice-section">
      <div className="Notice-content">
        <h1>
          Notice Page
        </h1>
        <p>Check out all the official notifications here</p>
      </div>
  </div>

<NoticeContent />

    </div>
  )
}

export default Notice