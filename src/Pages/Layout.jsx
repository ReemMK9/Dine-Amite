import React from 'react'
import Navbar from '../components/Common/Navbar/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div>
      <Navbar />
      <Outlet>
        
      </Outlet>
    </div>
  )
}

export default Layout