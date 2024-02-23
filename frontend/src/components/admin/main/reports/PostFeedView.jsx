import React, { useContext, useState } from "react";
import { Avatar, Button } from "@nextui-org/react";
import avatar from "../../../../assets/images/avatar.jpg";
import { IMAGE_URL, POST_IMAGE_URL } from "../../../../constants/urls";
import axiosInstance from "../../../../axios/axiosInstance";
import { ADMIN_POST_ACCESS } from "../../../../constants/admin_urls";
import { toast as hottoast } from "react-hot-toast";
import { LoadingContext } from '../../../../context/LoadingContext'

function PostFeedView({ post, comments, postAuthor, report_id }) {
  const [commentBox, setCommentBox] = useState(false);
  const [postStatus, setPostStatus] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const { showAdminLoading, hideAdminLoading, } = useContext(LoadingContext)


  const handleCommentBox = () => {
    if (commentBox) {
      setCommentBox(false);
    } else {
      setCommentBox(true);
    }
  };
  
  const handlePostStatus = (status) => {
    if (status) {
      setPostStatus(true);
    } else {
      setPostStatus(false);
    }
  };

  const handleReportSubmit = () => {
    const data = {
      'report_id': report_id,
      'comment': reviewComment,
      'post_id': postStatus ? post?.id : null
    }
    showAdminLoading()
    axiosInstance.post(`${ADMIN_POST_ACCESS}/update_post_report`, data)
    .then((res)=>{
      hottoast.success(res?.data?.message)
    })
    .catch((err)=>{
      
      hottoast.error(err?.response?.data?.error || 'Unable to update report')
    })
    .finally(()=>{
      hideAdminLoading()
    })
  }

  return (
    <>
      <div className="flex w-full p-8 ">
        <Avatar
          src={
            postAuthor?.profile_picture
              ? `${IMAGE_URL}${postAuthor?.profile_picture}`
              : ""
          }
        />
        <div className="flex flex-col flex-grow ml-4">
          <div className="flex">
            <span className="font-semibold">{postAuthor?.name}</span>
          </div>
          <p className="font-sans font-semibold text-lg">{post?.heading}</p>
          <p className="mt-1">{post?.content}</p>
          <div className="flex mt-2">
            <button className="text-sm font-semibold">
              Likes: ({post?.total_likes}){" "}
            </button>
            <button
              className="ml-2 text-sm font-semibold hover:underline underline-offset-2"
              onClick={handleCommentBox}
            >
              Comments: ({post?.comments ? post?.comments.length : 0})
            </button>
          </div>
          {post?.image && (
            <div className="p-2 mt-4">
              <img
                className="max-w-[35rem] rounded"
                src={`${POST_IMAGE_URL}${post?.image}`}
                alt=""
              />
            </div>
          )}
          <div
            className={`max-w-[35rem] rounded bg-slate-200 p-3 ${
              !commentBox ? "hidden" : ""
            }`}
          >
            <p className="text-black font-sans font-normal">Comments</p>
            {comments.map((comment) => (
              <div className="mt-4">
                <div className=" ml-2 flex items-center">
                  <div className="flex items-center space-x-2">
                    <Avatar
                      src={
                        comment?.commentor_picture
                          ? `${IMAGE_URL}${comment.commentor_picture}`
                          : avatar
                      }
                      size="sm"
                    />
                    <p className="text-small font-semibold leading-none text-default-600">
                      {comment?.commentor_name
                        ? comment?.commentor_name
                        : "User"}
                    </p>
                  </div>
                </div>

                <div className=" ml-2 mt-2 flex justify-between ">
                  <p className="text-black text-sm text-ellipsis max-w-[360px] whitespace-normal break-words">
                    {comment?.comment}
                  </p>
                  <p className="text-black text-sm ml-3">
                    {comment?.commented_time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="max-w-[35rem] my-2 ">
            <textarea
              className="w-full rounded border border-slate-300 focus:border-none"
              placeholder="Comment the review for the report"
              autocomplete="off"
              onChange={(e)=>setReviewComment(e.target.value)}
            />
          </div>
          <div className="flex py-3">
            <Button
              className={`mr-2 rounded-md transition duration-150 font-sans font-semibold ${!postStatus?"bg-green-500 text-white": 'border-3 text-green-500'}`}
              color={`#58e054`}
              onClick={()=>handlePostStatus(false)}
            >
              Approve
            </Button>
            <Button
            className={`mr-2 rounded  transition duration-150  font-sans font-semibold ${postStatus?"bg-red-500 text-white": 'border-3 text-red-500'}`}
              variant={`${postStatus ? "solid" : "flat"}`}
              onClick={()=>handlePostStatus(true)}
            >
              Block
            </Button>
          </div>
          <div className="py-3">
            <Button variant="solid" color="primary" onClick={handleReportSubmit}>Submit</Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default PostFeedView;
