import React from "react";

function Routelist() {
  return (
    <div className="h-screen bg-white border-slate-300 rounded-[10px] my-2">
      <div className="p-3 mt-2">
        <ul className="">
          <li className="p-2 m-2  text-center rounded-[10px] hover:bg-gradient-to-r from-purple-300 to-pink-300 text-pink-500 hover:text-white font-sans font-semibold">
            Home
          </li>
          <li className="p-2 m-2  text-center rounded-[10px] hover:bg-gradient-to-r from-purple-300 to-pink-300 text-pink-500 hover:text-white font-sans font-semibold">
            Feeds
          </li>
          <li className="p-2 m-2  text-center rounded-[10px] hover:bg-gradient-to-r from-purple-300 to-pink-300 text-pink-500 hover:text-white font-sans font-semibold">
            Chats
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Routelist;
