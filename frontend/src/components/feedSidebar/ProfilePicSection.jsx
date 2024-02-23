import React, { useContext, useEffect, useState } from "react";
import { UserPictureContext } from "../../context/UserPictureContext";


function ProfilePicSection() {
  
  const { userImage, name } = useContext(UserPictureContext)
  const [username, setUsername] = useState('')

  const removeSpacesAndToLowercase = (inputString) => {
    let stringWithoutSpaces = inputString.replace(/\s/g, '');
    let lowercaseString = stringWithoutSpaces.toLowerCase();
    return lowercaseString;
}

  useEffect(()=>{
    if (name) {
      let newname = removeSpacesAndToLowercase(name)
      setUsername(newname)
    }
  },[name])

  return (
    <div className="">
      <div className=" bg-white flex flex-col items-center p-2  rounded-[10px] ">
        <div className="w-full h-[50%] flex justify-center">
          <div className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[0.5rem]">
            <img
              className="rounded-full w-40 h-40 object-cover"
              src={userImage}
              alt=""
            />
          </div>
        </div>
        <div>
          <h1 className="text-lg text-center font-medium font-sans">{name}</h1>
          <h1 className="text-sm text-center font-sans text-slate-500">{`@${username}92`}</h1>
        </div>
      </div>
    </div>
  );
}

export default ProfilePicSection;
