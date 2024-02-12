import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Divider,
  Input as NxtInput,
} from "@nextui-org/react";
import { FaRegHeart, FaRegCommentDots } from "react-icons/fa";
import { TiHeartFullOutline } from "react-icons/ti";
import CommentBox from "./CommentBox";

function FeedPost() {
  const [like, setLike] = useState(false);
  const [commentBox, setCommentBox] = useState(false);

  const handleLike = () => {
    if (like) {
      setLike(false);
    } else {
      setLike(true);
    }
  };

  const handleCommentBox = () => {
    if (commentBox) {
      setCommentBox(false);
    } else {
      setCommentBox(true);
    }
  };

  return (
    <>
      {/*  */}
      <div className="my-3">
        <Card className="max-w-[540px] shadow-2xl z-10">
          <CardHeader className="justify-between">
            <div className="flex gap-5">
              <Avatar
                isBordered
                radius="full"
                size="md"
                src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp"
              />
              <div className="flex flex-col gap-1 items-start justify-center">
                <h4 className="text-small font-semibold leading-none text-default-600">
                  Zoey Lang
                </h4>
                <h5 className="text-small tracking-tight text-default-400">
                  @zoeylang
                </h5>
              </div>
            </div>
          </CardHeader>
          <Divider />
          <CardBody className="px-3 py-0 mt-1 text-small text-default-400 overflow-hidden">
            <img
              className="my-2"
              src="https://images.unsplash.com/photo-1621155346337-1d19476ba7d6?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGltYWdlfGVufDB8fDB8fHww"
              alt=""
            />
            <p className="text-black h-full">
              Frontend developer and UI/UX enthusiast. Join me on this coding
              adventure!
            </p>
            <span className="pt-2 text-black">
              #FrontendWithZoey
              <span className="py-2" aria-label="computer" role="img">
                💻
              </span>
            </span>
          </CardBody>
          <div className="flex justify-between p-3 mt-2">
            <div className="flex items-center gap-2">
              <TiHeartFullOutline color={"#E03846"} size={20} /> <p>25</p>
            </div>
            <div className="flex items-center gap-2">
              <FaRegCommentDots size={18} /> <p>14</p>
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
        <CommentBox commentBox={commentBox}/>
      </div>
      {/*  */}
    </>
  );
}

export default FeedPost;
