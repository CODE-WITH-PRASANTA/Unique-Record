import React from 'react'
import DashBoardHome from '../../Componenets/DashBoardHome/DashBoardHome'
import DashBoardSec from '../../Componenets/DashBoardSec/DashBoardSec'
import DashboardHistory from '../../Componenets/DashboardHistory/DashboardHistory'

const DashBoard = () => {
  return (
    <div>
      <DashBoardHome/>
      <DashBoardSec/>
      <DashboardHistory/>
    </div>
  )
}

export default DashBoard