import React, { useState } from "react";
import sidebarBg from "../../assets/images/matches_list_bg.png";
import MatchListing from './MatchListing'
import MatchedModal from "../modals/MatchedModal";
import { Outlet } from "react-router-dom"; 

function ContentArea() {
  const [modalOpen, setModalOpen] = useState(false);
  const [user, setUser] = useState([]);

  return (
    <>
      <div className="flex overflow-y-auto h-[88vh] rounded m-2 bg-slate-200 ">
        {/* Sidebar */}
        <div className=" bg-white w-[24rem] rounded-[10px] mx-1 overflow-y-auto hide-scrollbar">
          <MatchListing setModalOpen={setModalOpen} setUser={setUser} />
          <MatchedModal modalOpen={modalOpen} setModalOpen={setModalOpen} user={user} setUser={setUser} />
        </div>
        {/* End of sidebar */}
        
        {/* Content Area */}
        <div className=" bg-slate-200 relative w-screen rounded ml-1 flex items-center justify-center">
          {/* Components which uses navbar and sidebar */}
          <Outlet /> 
        </div>
        {/* End of content Area */}
      </div>

      
    </>
  );
}

export default ContentArea;
