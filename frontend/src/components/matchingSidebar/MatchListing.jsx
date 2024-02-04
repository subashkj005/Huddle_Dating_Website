import React, { useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
import axiosInstance from "../../axios/axiosInstance";
import { IMAGE_URL, USERS_URL } from "../../constants/urls";
import { useSelector } from "react-redux";
import avatar from "../../assets/images/avatar.jpg";
import matchlistbg from "../../assets/images/matches_list_bg.png";

function MatchListing() {
  const userId = useSelector((state) => state.logUser.user.id);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axiosInstance
      .get(`${USERS_URL}/get_matched_list/${userId}`)
      .then((res) => {
        setMatches(res.data);
      })
      .catch((err) => {
        console.log("ERR at machilist", err);
      });
  }, []);

  return (
    <>
      <div className="mt-2 sticky top-0 bg-white z-10">
        <h3 className="ml-4 font-sans text-lg font-medium p-2">Matches</h3>
      </div>
      <div className="relative">
        {matches?.length !== 0 ? (
          matches.map((match, idx) => (
            <div className="p-2" key={idx}>
              <div className="p-2 rounded-lg flex items-center transition duration-300 ease-in-out bg-gradient-to-r from-pink-200 to-sky-100">
                <div className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[0.2rem]">
                  <img
                    src={
                      match?.profile_picture
                        ? `${IMAGE_URL}${match?.profile_picture}`
                        : avatar
                    }
                    className="max-w-[3rem] max-h-[3rem] rounded-full border-2 border-white object-cover"
                  />
                </div>
                <div className="flex justify-between w-full">
                  <div className="ml-6">
                    <div className="mb-1">
                      <h3 className="text-lg font-medium font-sans">
                        {match?.name}, {match?.age ? `${match?.age} yrs` : ""}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="absolute top-48 flex flex-col justify-center items-center">
            <img className="w-[50%] h-[30%]" src={matchlistbg} alt="" />
            <p>Get your matches here</p>
          </div>
        )}
      </div>
    </>
  );
}

export default MatchListing;
