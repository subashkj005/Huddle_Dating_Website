import React, { useState } from "react";
import BasicNavbar from "../../../components/navbar/BasicNavbar";
import { FaPlus } from "react-icons/fa6";
import ImageUpload from "../../../components/imageUpload/ImageUpload";
import { createFormData } from "../../../utils/fileManagement/fileUpload";
import axios from "axios";
import { USERS_URL } from "../../../constants/urls";

function UserProfile() {
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    date_of_birth: "",
    gender: "",
    interested_in: "",
    educational_level: "",
    work: "",
  });
  const {
    name,
    phone_number,
    date_of_birth,
    gender,
    interested_in,
    educational_level,
    work,
  } = formData;
  const [images, setImages] = useState([]);
  const [imagesLink, setImagesLink] = useState([]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        const newImagesLink = [...imagesLink];

        newImages[newImages.length] = file;
        setImages(newImages);

        newImagesLink[newImagesLink.length] = reader.result;
        setImagesLink(newImagesLink);
        console.log("images", images);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (
      !name ||
      !date_of_birth ||
      !gender ||
      !interested_in
    ) {
      return null;
    }

    let data = createFormData(formData, images);
    console.log(data,'data')
    axios.post(`${USERS_URL}/profile/update`, data)
    .then(res=>{
      console.log(res)
    })
    .catch(err=>{
      console.log(err)
    }) 

  };

  return (
    <>
      <BasicNavbar />

      <div className="mx-auto lg:w-[70%] ">
        <div className="flex flex-col lg:flex-row ">
          <div className="lg:w-[40%] w-full mt-5 mb-5">
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Name
              </label>
              <input
                type="text"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="name"
                value={name}
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Phone number
              </label>
              <input
                type="number"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="phone_number"
                value={phone_number}
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Date of birth
              </label>
              <input
                type="date"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="date_of_birth"
                value={date_of_birth}
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Gender
              </label>
              <select
                className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="gender"
                value={gender}
                onChange={handleValueChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Interested in
              </label>
              <select
                className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="interested_in"
                value={interested_in}
                onChange={handleValueChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Educational Level
              </label>
              <select
                className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="educational_level"
                value={educational_level}
                onChange={handleValueChange}
              >
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Work
              </label>
              <input
                type="text"
                placeholder="Position"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="work"
                value={work}
                onChange={handleValueChange}
              />
            </div>
          </div>
          <div className=" lg:w-[60%] lg:ml-5">
            <div className="grid grid-cols-3 gap-12 mt-8">
              {imagesLink.length > 0 ? (
                <img
                  className="p-6 rounded-xl outline-8 outline-slate-400 outline-dashed"
                  src={imagesLink[0]}
                />
              ) : (
                <ImageUpload handleImageChange={handleImageChange} />
              )}
              {imagesLink.length > 1 ? (
                <img
                  className="p-6 rounded-xl outline-8 outline-slate-400 outline-dashed"
                  src={imagesLink[1]}
                />
              ) : (
                <ImageUpload handleImageChange={handleImageChange} />
              )}
              {imagesLink.length > 2 ? (
                <img
                  className="p-6 rounded-xl outline-8 outline-slate-400 outline-dashed"
                  src={imagesLink[2]}
                />
              ) : (
                <ImageUpload handleImageChange={handleImageChange} />
              )}
            </div>
          </div>
        </div>
        <button className="btn bg-[#fc449a]" onClick={()=>handleSubmit}>
          Save
        </button>
      </div>
    </>
  );
}

export default UserProfile;
