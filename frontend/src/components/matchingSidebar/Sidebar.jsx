import React, { useState } from "react";
import Display from "../userdisplay/Display";
import sidebarBg from "../../assets/images/matches_list_bg.png";
import MatchListing from './MatchListing'
import MatchedModal from "../modals/MatchedModal";


function Sidebar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState([]);

  return (
    <>
      <div className="flex overflow-y-auto h-[88vh] rounded m-2 bg-slate-200 ">
        <div className=" bg-white w-[24rem] rounded-[10px] mx-1 overflow-y-auto hide-scrollbar">
          <MatchListing setModalOpen={setModalOpen} setUser={setUser} />
          <MatchedModal modalOpen={modalOpen} setModalOpen={setModalOpen} user={user} setUser={setUser} />
        </div>
        <div className=" bg-slate-200 relative w-screen rounded ml-1 flex items-center justify-center">
          <Display />
        </div>
      </div>

      
    </>
  );
}

export default Sidebar;
