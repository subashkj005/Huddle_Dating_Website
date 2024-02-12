import React from "react";
import FeedPost from "./FeedPost";
import CreatePost from "./CreatePost";

function FeedContentArea() {
  return (
    <>
      <div
        className="relative flex flex-col items-center w-full h-full 
      bg-gradient-to-r rounded-lg from-purple-300 to-pink-300 text-pink-500
      m-auto overflow-y-scroll scrollbar-hide scroll-smooth"
      >
        <CreatePost/>
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
        <FeedPost />
      </div>
    </>
  );
}

export default FeedContentArea;
