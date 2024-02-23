import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure
} from "@nextui-org/react";
import { toast as hottoast } from "react-hot-toast";
import axiosInstance from "../../axios/axiosInstance";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import { TiHeartFullOutline } from "react-icons/ti";
import CommentBox from "./CommentBox";
import { IMAGE_URL, POST_IMAGE_URL, POST_URL } from "../../constants/urls";

function FeedPost({ post }) {
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post?.total_likes ? post.total_likes : 0
  );
  const [commentsCount, setCommentsCount] = useState(
    post?.comments ? post?.comments.length : 0
  );
  const [commentBox, setCommentBox] = useState(false);
  const [comments, setComments] = useState(
    post?.comments ? post?.comments : []
    );
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [reportReason, setReportReason] = useState("");
  const userId = useSelector((state) => state.logUser.user.id);
  let stringWithoutSpaces = post?.author?.name.replace(/\s/g, "");
  let lowercaseString = stringWithoutSpaces.toLowerCase();

  const handleLike = () => {
    if (like) {
      // setLike(false);
      handleLikeSubmit(userId, post.id, "dislike_post");
    } else {
      // setLike(true);
      handleLikeSubmit(userId, post.id, "like_post");
    }
  };


  const handleLikeSubmit = (userId, postId, path) => {
    const data = { liker_id: userId, post_id: postId };
    axiosInstance
      .post(`${POST_URL}/${path}`, data)
      .then((res) => {
        if (path === "like_post") {
          setLike(true);
          setLikeCount(likeCount + 1);
        } else {
          setLike(false);
          setLikeCount(likeCount - 1);
        }
      })
      .catch((err) => {
        console.log("error at liking post", err);
      });
  };

  const handleCommentBox = () => {
    if (commentBox) {
      setCommentBox(false);
    } else {
      setCommentBox(true);
    }
  };
  

  const handleReportlSubmit = () => {
    const data = {
      'reason': reportReason,
      'post_id': post?.id,
      'user_id': userId
      }
    axiosInstance.post(`${POST_URL}/register_report`, data)
    .then((res)=>{
      hottoast.success('Report Submitted 👍')
      setReportReason('')
    })
    .catch((err)=>{
      hottoast.error(`${err.response.data.error} ❌`)

    })
    
  }

  const handleClickReportSubmit = (onClose) => {
    onClose()
    handleReportlSubmit()
  }

  const handleCommentSubmit = (comment) => {
    const trimmedComment = comment.trim();
    if (trimmedComment === "") {
      return;
    }

    const data = {
      post_id: post?.id,
      user_id: userId,
      comment: trimmedComment,
    };
    axiosInstance
      .post(`${POST_URL}/add_comment`, data)
      .then((res) => {
        setComments([res?.data?.comment, ...comments]);
        setCommentsCount(commentsCount + 1);
      })
      .catch((err) => {
        hottoast.error("Unable to add comment");
      });
    console.log("comment data = ", data);
  };

  return (
    <>
      {/*  */}
      <div className="my-3">
        <Card className="max-w-[540px] min-w-[500px] shadow-2xl z-10">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src={`${IMAGE_URL}${post?.author?.profile_picture}`}
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  {post?.author?.name}
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  {`@${lowercaseString}`}
                </h5>
              </div>
            </div>
  
              <Popover placement="top">
                <PopoverTrigger>
                  <button className="border hover:bg-slate-200 rounded-full p-2"><BsThreeDots /></button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <Button onPress={onOpen} >Report</Button>
                  </div>
                </PopoverContent>
              </Popover>
            
          </CardHeader>
          <Divider />
          <CardBody className="px-3 py-0 mt-1 text-small text-default-400 overflow-hidden">
            {post?.heading && (
              <div className="text-black text-ellipsis text-lg font-sans">
                <p>{post?.heading}</p>
              </div>
            )}
            {post?.image && (
              <img
                className="my-2"
                src={`${POST_IMAGE_URL}${post?.image}`}
                alt=""
              />
            )}
            <p className="text-black h-full">{post?.content}</p>
            <span className="pt-2 text-black">
              {/* #FrontendWithZoey */}
              <span className="py-2" aria-label="computer" role="img">
                💻
              </span>
            </span>
          </CardBody>
          <div className="flex justify-between p-3 mt-2">
            <div className="flex items-center gap-2">
              <TiHeartFullOutline color={"#E03846"} size={20} />{" "}
              <p>{likeCount}</p>
            </div>
            <div className="flex items-center gap-2">
              <FaRegCommentDots size={18} /> <p>{commentsCount}</p>
            </div>
          </div>
          <Divider />
          <CardFooter className="flex justify-around">
            <div
              className="flex items-center gap-3 hover:bg-slate-100 hover:text-red-500 p-1 rounded"
              onClick={handleLike}
            >
              <p className=" text-default-400 text-base hover:text-black">
                Like
              </p>
              {!like ? (
                <FaRegHeart size={20} />
              ) : (
                <TiHeartFullOutline size={24} color={"#E03846"} />
              )}
            </div>
            <div
              className="flex items-center gap-2 hover:bg-slate-100 hover:text-black p-1 rounded"
              onClick={handleCommentBox}
            >
              <p className="text-slate-400 text-base hover:text-black">
                Comment
              </p>
              <FaRegCommentDots size={20} />
            </div>
          </CardFooter>
        </Card>
        {/* Comment Box */}
        <CommentBox
          handleCommentSubmit={handleCommentSubmit}
          commentBox={commentBox}
          comments={comments}
        />
      </div>
      {/*  */}

      {/* Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Report Post</ModalHeader>
              <ModalBody>
                <p>
                  Reason
                </p>
                <textarea type="text" value={reportReason} onChange={(e)=>setReportReason(e.target.value)} className="rounded border border-slate-400 focus:border-white" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="primary" onPress={()=>handleClickReportSubmit(onClose)}>
                  Send
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default FeedPost;
