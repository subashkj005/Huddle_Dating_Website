import React, { useEffect, useState } from "react";
import matched_png from "../../assets/images/match text.png";
import avatar from "../../assets/images/avatar.jpg";
import { IMAGE_URL, USERS_URL, USER_SOCKET } from "../../constants/urls";
import { customConfetti } from "../../utils/confetti/customConfetti";
import { useSelector } from "react-redux";
import { socket } from "../../socket/socketConfig";
import { Avatar, AvatarGroup } from "@nextui-org/react";
import axiosInstance from "../../axios/axiosInstance";


function MatchedModal({ modalOpen, setModalOpen, user, setUser }) {
  const userId = useSelector((state) => state.logUser.user.id);

  const handleSeenMatches = () => {
    let matchIds = [];
    for (const match of user) {
      if (match.is_seen === false) {
        matchIds.push(match.id);
      }
    }

    if (matchIds) {
      const data = { match_ids: matchIds };
      axiosInstance
        .post(`${USERS_URL}/update_seen`, data)
        .then((res) => {
          console.log("is_seen updated");
        })
        .catch((err) => {
          console.log("err when updating is seen");
        });
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    handleSeenMatches()
  };

  useEffect(() => {
    if (modalOpen) {
      customConfetti();
    }

    socket.on("match_found", (data) => {
      console.log("Match found:", data);
      setUser([data.match]);
      openModal();
    });
  }, [modalOpen, userId]);

  return (
    <div
      className="relative 
    "
    >
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity ease-in-out duration-300">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="">
            <div className="bg-white p-8 rounded-lg shadow-md z-10  transition-transform transform ease-in-out duration-300">
              {/* Image */}
              <img
                src={matched_png}
                alt="Modal Image"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
              {/* User Info */}
              <div className="p-2 mb-4">
                {user && user.length === 1 ? (
                  <>
                    <div className="p-2 rounded-lg flex items-center transition duration-300 ease-in-out bg-gradient-to-r from-pink-200 to-sky-100">
                      <div className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[0.2rem]">
                        <img
                          src={`${IMAGE_URL}${user[0].profile_picture}`}
                          className="max-w-[3rem] max-h-[3rem] rounded-full border-2 border-white object-cover "
                        />
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="ml-6">
                          <div className="mb-1">
                            <h3 className="text-lg font-medium font-sans">
                              {user?.[0]?.name},{" "}
                              {user?.[0]?.age ? `${user?.[0]?.age} yrs` : ""}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className={`p-2 rounded-lg flex ${
                        user?.length === 1 ? "" : "flex-col"
                      } items-center transition duration-300 ease-in-out bg-gradient-to-r from-pink-200 to-sky-100`}
                    >
                      <div
                        className={`relative inline-block rounded-full ${
                          user?.length === 1
                            ? "bg-gradient-to-r from-purple-500 to-pink-500"
                            : ""
                        } p-[0.2rem]`}
                      >
                        <AvatarGroup
                          color="danger"
                          isBordered
                          max={2}
                          total={
                            user && user.length > 3
                              ? user.length - 2
                              : undefined
                          }
                        >
                          {user &&
                            user.length > 1 &&
                            user?.map((item) => (
                              <Avatar
                                color="danger"
                                src={`${IMAGE_URL}${item.profile_picture}`}
                              />
                            ))}
                        </AvatarGroup>
                      </div>
                      <div className="flex justify-between w-full">
                        <div className="ml-6">
                          <div className="mb-1">
                            {user?.length === 1 ? (
                              <h3 className="text-lg font-medium font-sans">
                                {user?.name},{" "}
                                {user?.age ? `${user?.age} yrs` : ""}
                              </h3>
                            ) : (
                              <h3 className="text-lg text-center font-medium font-sans whitespace-pre-line">
                                New connections on the horizon, <br></br>
                                Ready for adventure! <br></br>
                                💖✨🌅
                              </h3>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-center">
                {user && user.length === 1 ? (
                  <>
                    <button
                      onClick={closeModal}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2 hover:text-white hover:bg-slate-600 duration-300"
                    >
                      Later
                    </button>
                    <button
                      onClick={closeModal}
                      className="border-1 border-pink-600 bg-slate-100  text-pink-600 hover:text-white hover:bg-pink-500 transition duration-250 px-4 py-2 rounded-md"
                    >
                      Chat Now
                    </button>
                  </>
                ) : (
                  <button
                    onClick={closeModal}
                    className="border-1 border-pink-600 bg-slate-100  text-pink-600 hover:text-white hover:bg-pink-500 transition duration-250 px-4 py-2 rounded-md"
                  >
                    Explore
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchedModal;
