import React from "react";
import ProfilePicSection from "../feedSidebar/ProfilePicSection";
import Routelist from "../feedSidebar/Routelist";



function FeedSidebar() {
  return (
    <div className="w-[20rem] rounded-[10px] mx-1 overflow-y-auto hide-scrollbar">
      <ProfilePicSection/>
      <Routelist/>
    </div>
  );
}

export default FeedSidebar;
