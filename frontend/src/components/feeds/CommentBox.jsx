import React from "react";
import {Avatar} from "@nextui-org/react";

function CommentBox({commentBox}) {
  return (
    <>
      <div
        className={`p-2 bg-white rounded-[6px] mt-1 max-w-[478px] ${
          commentBox ? "" : "hidden"
        }`}
      >
        <div class="bg-white p-3">
          <div class="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Type your comment here..."
              class="flex-1 border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-pink-300"
            />
            <button class="bg-gradient-to-r rounded-lg from-purple-400 to-pink-400 text-white px-4 py-2">
              Comment
            </button>
          </div>
        </div>

        <div class="mt-4">
          <div class="bg-white ml-2 flex items-center">
            <div class="flex items-center space-x-2">
              <Avatar
                src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                size="sm"
              />
              <p class="text-small font-semibold leading-none text-default-600">
                John Doe
              </p>
            </div>
          </div>

          <div class="bg-white ml-2 mt-1 flex justify-between ">
            <p class="text-black text-sm text-ellipsis max-w-[360px]">
              Lorem ipsum dolor sit amet. sdfsfs sdf sd sfd sdw erwe werwer
              werwe wer werwer wer
            </p>
            <p class="text-gray-500 text-sm ml-3">Yesterday 2.00PM</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommentBox;
