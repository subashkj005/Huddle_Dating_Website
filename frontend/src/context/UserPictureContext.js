import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../axios/axiosInstance";
import { IMAGE_URL, USERS_URL } from "../constants/urls";

export const UserPictureContext = createContext();

export const UserPictureProvider = ({ children }) => {
  const [userImage, setUserImage] = useState(null);
  const [name, setName] = useState(null);
  const [fetch, setFetch] = useState(false)
  const user = useSelector((state) => state?.logUser?.user);

  const handleFetch = () => {
    if(fetch){
      setFetch(false)
    } else {
      setFetch(true)

    }
  }

  useEffect(() => {
    if (user && user.role ==='user') {
      axiosInstance
        .get(`${USERS_URL}/get_profile_picture/${user.id}`)
        .then((res) => {
          setUserImage(`${IMAGE_URL}${res?.data?.userImage}`);
          setName(res?.data?.name)
        })
        .then((err) => {
          console.log("profile picture context err", err);
        });
    }
  }, [fetch]);

  return (
    <UserPictureContext.Provider value={{ userImage, setUserImage, name, setName, handleFetch }}>
      {children}
    </UserPictureContext.Provider>
  );
};
