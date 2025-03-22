import React from 'react'
import './Event.css'
import EventInformation from '../../Components/EventInformation/EventInformation'
import EventGalary from '../../Components/EventGalary/EventGalary'
import AllEvents from '../../Components/AllEvents/AllEvents'
import ScheduleBooking from '../../Components/ScheduleBooking/ScheduleBooking'

const Event = () => {
  return (
    <div>
         <div className="LearnMore-section">
      <div className="LearnMore-content">
        <h1>
           Event
        </h1>
        <p>Unique Records of Universe </p>
      </div>
    </div>

    <EventInformation />
    <AllEvents />
    <EventGalary />
    <ScheduleBooking />
    </div>
  )
}

export default Event