import React, { useEffect, useState } from "react";
import matched_png from "../../assets/images/match text.png";

import { USER_SOCKET } from "../../constants/urls";
import { customConfetti } from "../../utils/confetti/customConfetti";
import { useSelector } from "react-redux";
import { socket } from "../../socket/socketConfig";


function MatchedModal() {
  const userId = useSelector((state) => state.logUser.user.id);
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const invokeMatch = () => {
    openModal()

  }

  useEffect(() => {
    if (modalOpen) {
      customConfetti();
    }

    socket.on('match_found', (data) => {
      
      console.log('Match found:', data);
      openModal()
      
    });

  }, [modalOpen, userId]);

  return (
    <div
      className="relative 
    "
    >
      {/* Trigger Button */}
      <button onClick={openModal} className="bg-blue-500 text-white px-4 py-2">
        Open Modal
      </button>

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
                <div className="p-2 rounded-lg flex items-center transition duration-300 ease-in-out bg-gradient-to-r from-pink-200 to-sky-100">
                  <div className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[0.2rem]">
                    <img
                      src="https://i.pravatar.cc/150?u=a04258114e29026708c"
                      className="max-w-[3rem] max-h-[3rem] rounded-full border-2 border-white object-cover "
                    />
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="ml-6">
                      <div className="mb-1">
                        <h3 className="text-lg font-medium font-sans">
                          Name, 23yrs
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center">
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchedModal;
