import React from 'react'

function ImageUpload(props) {
  return (
    <label htmlFor="fileInput" 
      className='p-10 bg-[rgb(238,213,176)] flex items-center
       justify-center rounded-xl outline-8 outline-[#fc449a]
        outline-dashed text-[#fc449a] text-center text-2xl
         font-extrabold'
         onChange={(e) => props.handleImageChange(e)}>
        +
        <input
          type="file"
          id="fileInput"
          className="input-file hidden cursor-pointer"
          
        />
      </label>
  )
}

export default ImageUpload