import React, { useEffect, useState } from "react";
import FeedPost from "./FeedPost";
import CreatePost from "./CreatePost";
import axiosInstance from "../../axios/axiosInstance";
import { POST_URL } from "../../constants/urls";
import { useSelector } from "react-redux";

function FeedContentArea() {
  const [pageNumber, setPageNumber] = useState(1);
  const [posts, setPosts] = useState([]);
  const userId = useSelector((state) => state.logUser.user.id);

  const fetchFeeds = () => {
    const data = { user_id: userId };
    axiosInstance
      .post(`${POST_URL}/get_feeds/${pageNumber}`, data)
      .then((res) => {
        console.log('feed data res => ', res)
        setPosts(res?.data)
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchFeeds();
  }, []);
  return (
    <>
      <div
        className="relative flex flex-col items-center w-full h-full 
      bg-gradient-to-r rounded-lg from-purple-300 to-pink-300 text-pink-500
      m-auto overflow-y-scroll scrollbar-hide scroll-smooth"
      >
        <CreatePost posts={posts} setPosts={setPosts} />

        {posts.map((post)=>(
          <FeedPost post={post}/>
        ))}
      </div>
    </>
  );
}

export default FeedContentArea;
