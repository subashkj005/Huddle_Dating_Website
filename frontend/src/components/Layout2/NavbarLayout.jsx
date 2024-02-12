import React from 'react'
import BasicNavbar from '../navbar/BasicNavbar'
import { Outlet } from 'react-router-dom'

function NavbarLayout() {
  return (
    <>
    <BasicNavbar/>
    <Outlet/>
    </>
  )
}

export default NavbarLayout