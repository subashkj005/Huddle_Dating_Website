import React from "react";
import { Avatar } from "@nextui-org/react";
import MatchedModal from "../modals/MatchedModal";

function MatchListing() {
  return (
    <>
      <div className="ml-4 mt-2">
        <h3 className="font-sans text-lg font-medium p-2">Matches</h3>
      </div>
      <div className="p-2 ">
        <div className="p-2 bg-slate-200 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-gradient-to-r from-pink-200 to-sky-100">
          <div className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[0.2rem]">
            <img
              src="https://i.pravatar.cc/150?u=a04258114e29026708c"
              className="max-w-[3rem] max-h-[3rem] rounded-full border-2 border-white object-cover "
            />
            <span class="dot dot-success absolute bottom-1 right-1"></span>
          </div>
          <div className="flex justify-between w-full">
            <div className="ml-2">
              <div className="mb-1">
                <h3 className="text-sm font-medium font-sans">Name</h3>
              </div>
              <div>
                <p className="text-xs font-sans font-medium">
                  Hello, How are you ?
                </p>
              </div>
            </div>
            <div className="flex-col ">
              <span class="badge badge-error text-[0.5rem] ">2</span>

              <div>
                <span className="text-[0.6rem]">12.00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MatchedModal />
    </>
  );
}

export default MatchListing;
