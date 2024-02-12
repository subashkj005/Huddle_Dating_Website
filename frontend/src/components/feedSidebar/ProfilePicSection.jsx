import React from "react";

function ProfilePicSection() {
  return (
    <div className="">
      <div className=" bg-white flex flex-col items-center p-2  rounded-[10px] ">
        <div className="w-full h-[50%] flex justify-center">
          <div className="relative inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-[0.5rem]">
            <img
              className="rounded-full w-40 h-40 object-cover"
              src="https://a.storyblok.com/f/191576/1200x800/faa88c639f/round_profil_picture_before_.webp"
              alt=""
            />
          </div>
        </div>
        <div>
          <h1 className="text-lg text-center font-medium font-sans">Aleena</h1>
          <h1 className="text-sm text-center font-sans text-slate-500">@aleena92</h1>
        </div>
      </div>
    </div>
  );
}

export default ProfilePicSection;
