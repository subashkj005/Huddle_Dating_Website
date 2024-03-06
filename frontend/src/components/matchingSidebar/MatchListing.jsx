import React, { useEffect, useState, useMemo } from "react";
import { Avatar } from "@nextui-org/react";
import axiosInstance from "../../axios/axiosInstance";
import { IMAGE_URL, USERS_URL } from "../../constants/urls";
import { useDispatch, useSelector } from "react-redux";
import avatar from "../../assets/images/avatar.jpg";
import matchlistbg from "../../assets/images/matches_list_bg.png";
import { Link } from "react-router-dom";
import { addMatches } from "../../redux/slices/chatListSlice";

function MatchListing({ setModalOpen, setUser }) {
  const userId = useSelector((state) => state.logUser.user.id);
  const [matches, setMatches] = useState([]);
  const [unseenMatchesSet, setUnSeenMatchesSet] = useState(false);
  const dispatch = useDispatch();
  const currentTime = new Date();

  const showUnseenMatches = (matches) => {
    let unSeenMatches = [];
    let seenMatches = [];

    for (const match of matches) {
      if (match.is_seen === true) {
        seenMatches.push(match);
      } else {
        unSeenMatches.push(match);
      }
    }

    setMatches(seenMatches);

    if (!unseenMatchesSet && unSeenMatches.length > 0) {
      setTimeout(() => {
        setUser(unSeenMatches);
        setModalOpen(true);
        setMatches((prevMatches) => [...prevMatches, ...unSeenMatches]);
        setUnSeenMatchesSet(true); // It is setting for not rendering it for twice
      }, 2000);
    }
  };

  useEffect(() => {
    axiosInstance
      .get(`${USERS_URL}/get_matched_list/${userId}`)
      .then((res) => {
        showUnseenMatches(res.data);
        dispatch(addMatches(res.data));
      })
      .catch((err) => {
        console.log("ERR at machilist", err);
      });
  }, [userId]);

  return (
    <>
      <div className="mt-2 sticky top-0 bg-white z-10">
        <h3 className="ml-4 font-sans text-lg font-medium p-2">Matches</h3>
      </div>
      <div className="relative">
        {matches?.length !== 0 ? (
          matches.map((match, idx) => {
            const matchExpiresAt = new Date(match.expires_at); 
            if (matchExpiresAt >= currentTime) {
              return (
                <div className={`p-2`} key={idx}>
                  <Link to={`/user/chat/${match.chatroom_name}`}>
                    <div className="p-2 rounded-lg flex items-center transition duration-150 ease-in-out bg-gradient-to-r from-pink-200 to-sky-100 hover:text-3xl hover:scale-95">
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
                              {match?.name},{" "}
                              {match?.age ? `${match?.age} yrs` : ""}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            } else {
              return null; // Return null if match.expires_at is less than current time
            }
          })
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
