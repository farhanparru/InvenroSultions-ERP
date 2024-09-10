import React,{useState} from 'react'
import './App.css'
import Headr from './Adminpanle/Headr'
import Sidebar from './Adminpanle/Sidebar'
import FullWrapp from './Adminpanle/Home/FullWrapp'

const Wrapp = () => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className="grid-container">
     <Headr OpenSidebar={OpenSidebar}/>
     <Sidebar  openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
     <FullWrapp/>
    </div>

  )
}

export default Wrapp
