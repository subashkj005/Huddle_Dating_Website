import React from 'react'

function ImageUpload(props) {
  return (
    
    <label  
      className='p-10 bg-[rgb(233,233,233)] flex items-center
       justify-center rounded-xl outline-3 outline-[#fd7ab7]
        outline-dashed text-[#fc449a] text-center text-2xl
         font-extrabold'
         >
        +
        <input
          type="file"
          name={props.name}
          className="input-file hidden cursor-pointer"
          onChange={props.handleImageChange}
          
        />
      </label>
  )
}

export default ImageUpload