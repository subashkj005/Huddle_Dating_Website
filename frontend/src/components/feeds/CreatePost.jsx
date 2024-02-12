import React, {useState} from "react";
import { Avatar, Button } from "@nextui-org/react";
import { BsImages } from "react-icons/bs";
import { FaHeading } from "react-icons/fa6";

function CreatePost() {

    const [image, setImage] = useState(null)
    const [heading, setHeading] = useState("")
    const [headingTrigger, setHeadingTrigger] = useState(false)

    const handleImage = (e) => {
        const file = e.target.files[0]
        setImage(file)
    }

    const handleHeadingButton = () => {
        if (headingTrigger) {
            setHeadingTrigger(false)
        } else {
            setHeadingTrigger(true)

        }
    }

  return (
    <>
      <div className="my-3 p-4 bg-white rounded-[5px] min-w-[580px]">
        <div className="flex gap-4 p-1 justify-evenly w-full">
          <Avatar
            src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
            size="md"
          />
          <textarea
            className="rounded-md text-black text-base border-slate-300 focus:bg-slate-100 focus:border-slate-300 max-w-[400px] w-full"
            type="text"
            placeholder="What's on your mind ?"
          />
          <div>
            <Button className="bg-pink-300 hover:bg-pink-500 text-white rounded-lg p-2">Create</Button>
          </div>
        </div>
        <div className="p-2 ">
          <div className="p-1 flex items-center justify-evenly gap-3">
            <span 
            className="flex gap-2 rounded-lg bg-slate-100 items-center p-2 text-black text-sm "
            onClick={handleHeadingButton}
            >
              <FaHeading color={"#d8a353"} /> Heading
            </span>
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex gap-2 rounded-lg bg-slate-100 items-center p-2 text-black text-sm"
            >
              <BsImages color={"#2ea3c7"} /> Images
              <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleImage}
                accept="image/*"
              />
            </label>
          </div>
        </div>
        <div className="flex flex-col justify-center">
        <input className={`rounded border-slate-300 text-black focus:border-slate-100 ${!headingTrigger? "hidden": ""}`} type="text" />
        {image && (
            <img
              className="my-2 object-cover rounded-md max-w-[560px] max-h-[360px]"
              src={URL.createObjectURL(image)}
              alt=""
            />
            )}
            </div>
      </div>
    </>
  );
}

export default CreatePost;
