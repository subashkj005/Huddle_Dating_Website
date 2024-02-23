import React, { useState } from "react";
import {Avatar} from "@nextui-org/react";
import { Button } from '@nextui-org/react'
import { IMAGE_URL } from "../../constants/urls";
import avatar from '../../assets/images/avatar.jpg'

function CommentBox({commentBox, handleCommentSubmit, comments}) {

  const [newComment, setNewComment] = useState("")
  
  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
};

  const SubmitComment = (newComment) => {
    handleCommentSubmit(newComment)
    setNewComment("")
  }



  return (
    <>
      <div
        className={`p-2 bg-white rounded-[6px] mt-1 max-w-[478px] ${
          commentBox ? "" : "hidden"
        }`}
      >
        <div className="bg-white p-3">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Type your comment here..."
              onChange={handleCommentChange}
              value={newComment}
              className="flex-1 border border-gray-300 px-4 py-2 rounded-lg text-black focus:outline-none focus:border-pink-300"
            />
            <Button 
            className="bg-gradient-to-r rounded-lg from-purple-400 to-pink-400 text-white px-4 py-2"
            onClick={()=>SubmitComment(newComment)}
            >
              Comment
            </Button>
          </div>
        </div>

        {comments.map((comment)=>(
          <div className="mt-4">
          <div className="bg-white ml-2 flex items-center">
            <div className="flex items-center space-x-2">
              <Avatar
                src={comment?.commentor_picture?`${IMAGE_URL}${comment.commentor_picture}`:avatar}
                size="sm"
              />
              <p className="text-small font-semibold leading-none text-default-600">
                {comment?.commentor_name?comment?.commentor_name:'User'}
              </p>
            </div>
          </div>

          <div className="bg-white ml-2 mt-1 flex justify-between ">
            <p className="text-black text-sm text-ellipsis max-w-[360px] whitespace-normal break-words">
              {comment?.comment}
            </p>
            <p className="text-gray-500 text-sm ml-3">{comment?.commented_time}</p>
          </div>
        </div>
        ))}
      </div>
    </>
  );
}

export default CommentBox;
