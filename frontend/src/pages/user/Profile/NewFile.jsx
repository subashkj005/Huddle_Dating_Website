import React, { useState } from 'react'
import axiosInstance from '../../../axios/axiosInstance'

function NewFile() {
    const [image, setImage] = useState(null)
    console.log(image)
    

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        console.log( 'file type ==>',typeof(file))
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1]
            setImage(
                {
                    id: '7sf87dfsdf89',
                    image: base64Data
                }
            )
            
        }
        reader.onerror = (error) => {
            console.error("Error:", error);
        };
    }

    const handleSubmit = () => {
        axiosInstance.post('http://127.0.0.1:7614/public/add_image', image)
        .then((res)=> {
            console.log(res)
        })
    }


  return (
    <div>
        <input type="file" className="input-file input-file-primary" onChange={handleImageUpload} />
        <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default NewFile