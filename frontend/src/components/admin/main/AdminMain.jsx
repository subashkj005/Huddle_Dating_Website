import React from 'react'

import AdminHeader from './header/AdminHeader'
import AdminSection from './section/AdminSection'


function AdminMain() {
  return (
    <>
        <main className='w-[calc(100% -256px)] ml-64 bg-gray-50 min-h-screen'>
            <AdminHeader/>
            <AdminSection/>
        </main>
    </>
  )
}

export default AdminMain