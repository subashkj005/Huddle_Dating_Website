import React from 'react'
import logo from '../../../assets/images/huddle_logo_icon_small.png'
import { Link } from 'react-router-dom'
import { useLocation } from "react-router-dom";
import { RiHome4Line } from '@remixicon/react'
import { RiUserLine } from '@remixicon/react'
import { BiSolidReport } from "react-icons/bi";


function AdminSidebar() {

    const location = useLocation()
    const currentUrl = location.pathname

  return (
    <>
    <div className='fixed top-0 left-0 h-full w-64 bg-gray-700' >
        <div className='flex items-center p-4 border-b border-b-gray-800' >
            <img className='w-8 h-8 ml-3 rounded object-cover' src={logo} alt="" />
            <span className='text-lg text-white ml-3'>Huddle Admin</span>
        </div>
        <ul className='mt-4'>
            <li className='mb-1 group active'>
                <Link className='flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 hover:text-gray-100 rounded-md group-[.active]:text-white'>
                <RiHome4Line
                    size={20} 
                    color="white" 
                    className="mr-3 text-lg" 
                />
                <span className='text-sm'>Dashboard</span>
                </Link>
            </li>
            <li className='mb-1 group'>
                <Link to="/admin" className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 rounded-md ${currentUrl === '/admin'? 'bg-gray-800': "" } group-[.active]:text-white`}>
                <RiUserLine
                    size={20} 
                    color="white" 
                    className="mr-3 text-lg" 
                />
                <span className='text-sm'>Users</span>
                </Link>
            </li>
            <li className='mb-1 group'>
                <Link to="/admin/reports" className={`flex items-center py-2 px-4 text-gray-300 hover:bg-gray-950 rounded-md ${currentUrl === '/admin/reports'? 'bg-gray-800': "" } group-[.active]:text-white`}>
                <BiSolidReport 
                    size={20} 
                    color="white" 
                    className="mr-3 text-lg" 
                />
                <span className='text-sm'>Reports</span>
                </Link>
            </li>
        </ul>
    </div>
    </>
  )
}

export default AdminSidebar