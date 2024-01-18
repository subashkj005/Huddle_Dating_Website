import React from "react";
import Display from "../userdisplay/Display";
import sidebarBg from "../../assets/images/matches_list_bg.png";

function Sidebar() {

  return (
    <>
      <div className="flex overflow-y-auto h-[88vh] rounded m-2 bg-slate-200 ">
        <div className=" bg-white w-[24rem] rounded-[10px] mx-1 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <img className="w-[50%] h-[30%]" src={sidebarBg} alt="" />
            <p>Get your matches here</p>
          </div>
        </div>
        <div className=" bg-slate-200 w-screen rounded ml-1 flex items-center justify-center">
          <Display />
        </div>
      </div>

      
    </>
  );
}

export default Sidebar;
