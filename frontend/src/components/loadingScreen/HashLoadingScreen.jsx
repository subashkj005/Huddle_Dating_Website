import React from 'react'
import HashLoader from "react-spinners/HashLoader";

function HashLoadingScreen() {
  return (
    <div className='flex justify-center items-center h-screen'>
        <HashLoader color="#fc449a" size={80}/>
    </div>
  )
}

export default HashLoadingScreen