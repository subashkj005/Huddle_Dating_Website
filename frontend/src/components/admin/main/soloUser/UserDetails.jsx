import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../../axios/axiosInstance";
import { Avatar, Button } from "@nextui-org/react";
import { ADMIN_USER_ACCESS } from "../../../../constants/admin_urls";
import avatar from "../../../../assets/images/avatar.jpg";
import { IMAGE_URL } from "../../../../constants/urls";

function UserDetails() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    axiosInstance
      .post(`${ADMIN_USER_ACCESS}/user_details/${userId}`)
      .then((res) => {
        setUser(res?.data?.user);
        console.log("res in user details", res);
      })
      .catch((err) => {
        console.log("error at getting user details : ", err);
      });
  }, []);

  return (
    <>
      {user ? (
        <>
          <div className="flex items-center justify-between border border-gray-200 p-4 rounded-lg shadow-md">
            {/* Left Div */}
            <div className="flex items-center space-x-4">
              {/* User Image */}
              <div className="relative w-20 h-20">
                <Avatar
                  className="w-20 h-20 text-large"
                  src={
                    user?.profile_picture
                      ? user.profile_picture.startsWith("http")
                        ? user.profile_picture
                        : `${IMAGE_URL}${user.profile_picture}`
                      : avatar
                  }
                />
              </div>
              {/* User Details */}
              <div>
                <h2 className="text-lg font-semibold">{user?.name}</h2>
                <p className="text-sm text-gray-500">{`Age: ${user?.age}`}</p>
                <p className="text-sm text-gray-500 py-3">
                  {user.is_active ? (
                    <button className="btn btn-solid-success">Active</button>
                  ) : (
                    <button className="btn btn-solid-error">Deactivated</button>
                  )}
                </p>
              </div>
            </div>
            <div>
              <Button>Reports</Button>
            </div>
          </div>
          <div className="border border-gray-200 p-4 rounded-lg shadow-md mt-4 flex justify-evenly">
            <ul className="">
              <li className="flex">
                <strong>User ID:</strong>
                <span className="ml-2">{user.id}</span>
              </li>
              <li className="flex">
                <strong>Email Address:</strong>
                <span className="ml-2">{user.email}</span>
              </li>
            </ul>
            <ul className="">
              <li className="flex">
                <strong>Location :</strong>
                <span className="ml-2">{user.location}</span>
              </li>
              <li className="flex">
                <strong>Joined At:</strong>
                <span className="ml-2">{user.created_at}</span>
              </li>
            </ul>
          </div>
        </>
      ) : (
        <div className="animate-pulse">
          <div className="h-16 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
        </div>
      )}
    </>
  );
}

export default UserDetails;
