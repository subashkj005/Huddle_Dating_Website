import React from "react";
import FeedSidebar from "../../../components/feeds/FeedSidebar";
import FeedContentArea from "../../../components/feeds/FeedContentArea";

function FeedsPage() {
  return (
    <>
      <div className="flex overflow-y-auto h-[88vh] rounded m-2 bg-slate-200 ">
        <FeedSidebar />
        <FeedContentArea />
      </div>
    </>
  );
}

export default FeedsPage;
