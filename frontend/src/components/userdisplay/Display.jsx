import React, { useEffect, useState } from "react";
import { RiVerifiedBadgeFill } from "@remixicon/react";
import { FaQuoteRight } from "react-icons/fa6";
import Drinks from "../badges/Drinks";
import DatingPurpose from "../badges/DatingPurpose";
import Smoking from "../badges/Smoking";
import Workout from "../badges/Workout";
import ZodiacSign from "../badges/ZodiacSign";
import gradientImage from "../../assets/images/gradient background.jpg";
import Height from "../badges/Height";
import Gender from "../badges/Gender";
import "../../assets/styles/heart.css";
import "../../assets/styles/carouselsAnimation.css";
import heart from "../../assets/images/pink_heart.png";
import { MdCancel } from "react-icons/md";
import { BsLightningFill } from "react-icons/bs";
import fake_details from "../../temp_data/user_data";
import { IMAGE_URL, USERS_URL } from "../../constants/urls";
import UserSettings from "../userSettingsModal/UserSettings";
import axiosInstance from "../../axios/axiosInstance";
import { useSelector } from "react-redux";
import useFetchRecommends from '../../hooks/useFetchRecommends'

function Display() {

  const [
    data,
    setData, 
    account, 
    setAccount, 
    isLimitReached, 
    setLimitReached,  
    fetchMoreUsers] = useFetchRecommends();
  const [accountIndex, setAccountIndex] = useState(0);
  const [animation, setAnimation] = useState(false);
  const [slides, setSlides] = useState([]);

  console.log('data  =>', data)

  let counter = 0; // Counter for slider
  let lastScrollTime = 0; // Carousel scrolltime

  const handleSlideChange = (movement) => {

    if (movement == "forward" && accountIndex < data.length) {
      setAccountIndex((prevState) => prevState + 1);
      setAnimation(true);
      setTimeout(() => {
        setAnimation(false);
      }, 500);
      setAccount(data[accountIndex]);
      console.log('a/c index =', accountIndex)

      if (!isLimitReached && accountIndex == (data.length - 5)){
        console.log('calling for fetching more users')
        fetchMoreUsers()
      }

      if (data.length > 20) {
        let accounts = data
        const sliced_accounts = accounts.slice(10)
        setData(sliced_accounts)
        setAccountIndex(prevState => prevState - 10)
        
      }

    } else if (movement == "backward" && accountIndex > -1) {
      setAccountIndex((prevState) => prevState - 1);
      setAnimation(true);
      setTimeout(() => {
        setAnimation(false);
      }, 1000);

      setAccount(data[accountIndex]);
  
    }
    handleSlidePosition();
  };

  const handleSlidePosition = () => {
    slides.forEach((e) => {
      e.style.transform = `translateY(-${0 * 100}%)`;
    });
  };

  useEffect(() => {

    const carousel = document.getElementById("carousel");
    const contentSlides = carousel.querySelectorAll(".carousel-wrapper");
    setSlides(contentSlides);

    contentSlides?.forEach((slide, index) => {
      slide.style.top = `${index * 100}%`;
    });

    const slideImage = () => {
      contentSlides.forEach((e) => {
        e.style.transform = `translateY(-${counter * 100}%)`;
      });
    };

    carousel?.addEventListener("wheel", (event) => {
      event.preventDefault();

      const currentTime = Date.now();
      if (currentTime - lastScrollTime > 200) {
        lastScrollTime = currentTime;

        const delta = Math.sign(event.deltaY);
        counter += delta;
        counter = Math.max(0, Math.min(counter, contentSlides.length - 1));
        slideImage();
      }
    });
  }, [counter]);

  return (
    <>
      <div className="absolute top-2 left-5">
        <UserSettings />
      </div>

      <div
        id="carousel"
        className={`carousel-container ${
          animation ? "animate" : ""
        } relative overflow-hidden flex flex-col overflow-y-hidden w-[68%] h-[94%] rounded-[10px] bg-white shadow-2xl`}
      >
        <div className="bg-red-600 "></div>
        <img className="blur-3xl" src={gradientImage} alt="" />
        <div className=" flex content-between absolute left-1/2 transform -translate-x-1/2 bottom-0 w-[40%] opacity-95 p-4 z-10 rounded">
          <div className=" mt-10 mr-5 bg-red-400 rounded-full">
            <MdCancel color="white" size={88} className="hover:text-red-500" />
          </div>
          <div className=" mb-10 bg-red-400 rounded-full">
            <BsLightningFill size={88} className="p-2" />
          </div>
          <div className="mt-10 ml-5 p-2 bg-[#f7adcf] rounded-full flex justify-center items-center">
            <img
              className="heart"
              src={heart}
              alt=""
              onClick={() => handleSlideChange("forward")}
            />
          </div>
        </div>

        {/* -------------------first one------------------- */}
        <div
          className={`carousel-wrapper ${
            animation ? "fadein" : ""
          } transition duration-500 ease-in-out absolute top-0 left-0 flex items-center justify-center w-[100%]`}
        >
          {/*  Left side for images  */}
          <div className="carousel-images flex-shrink-0 w-1/2 bg-yellow-400">
            {/*  Image items go here  */}
            <img
              src={
                account
                  ? account.images
                    ? `${IMAGE_URL}${account?.images[0]}`
                    : ""
                  : ""
              }
              alt="Image 1"
              className="h-[100%] w-[100%] object-cover"
            />
            {/*  Add more images as needed  */}
          </div>

          {/* <!-- Right side for text or other contents --> */}
          <div className="carousel-text h-full flex justify-center items-center flex-shrink-0 w-1/2">
            {/* <!-- Text or content items go here --> */}
            <div className="text-content ">
              <h1 className="font-sans font-semibold text-3xl flex items-center justify-center">
                {account ? account.name : ""}
                <div className="ml-2">
                  {account?.is_verified ? <RiVerifiedBadgeFill color="#249ef0" /> : ""}
                </div>
              </h1>
            </div>
          </div>
        </div>

        {/* -------------------About------------------- */}
        <div className="carousel-wrapper transition duration-500 ease-in-out absolute top-0 left-0 h-full w-full flex flex-col items-center justify-center">
          <div className="mb-6">
            <h3 className="font-sans text-xl font-semibold text-center mb-1">About</h3>
            <p className="font-sans text-center px-10">{account?.bio ? account.bio : ""}</p>
          </div>
          <div className="flex justify-center flex-wrap w-[70%] text-lg font-normal">
            {account?.height && <Height value={account.height} />}
            {account?.interests?.drinks && (
              <Drinks value={account.interests.drinks} />
            )}
            {account?.interests?.workout && (
              <Workout value={account.interests.workout} />
            )}
            {account?.interests?.smoking && (
              <Smoking value={account.interests.smoking} />
            )}
            {account?.gender && <Gender value={account.gender} />}
            {account?.interests?.zodiac_sign && (
              <ZodiacSign value={account.interests.zodiac_sign} />
            )}
            {account?.interests?.dating_purpose && (
              <DatingPurpose value={account.interests.dating_purpose} />
            )}
          </div>
        </div>

        {/* -------------------prompt------------------- */}
        <div className="carousel-wrapper transition duration-500 ease-in-out absolute top-0 left-0 flex items-center justify-center w-[100%] mt-6">
          {/*  Left side for images  */}
          <div className="carousel-images flex-shrink-0 w-1/2 bg-yellow-400">
            {/*  Image items go here  */}
            <img
              src={account?.images ? account.images[1] ? `${IMAGE_URL}${account?.images[1]}` : `${IMAGE_URL}${account?.images[0]}` : ""}
              alt="Image 1"
              className="h-[100%] w-[100%] object-cover"
            />
            {/*  Add more images as needed  */}
          </div>

          {/* <!-- Right side for text or other contents --> */}
          <div className="carousel-text h-full flex justify-center items-center flex-shrink-0 w-1/2">
            {/* <!-- Text or content items go here --> */}
            <div className="text-content ">
              <div className="text-center flex justify-center content-center">
                <FaQuoteRight />
              </div>
              <h1 className="font-sans font-semibold px-10 pt-2 text-xl flex items-center justify-center">
                {account?.prompts ? account.prompts[0] : ""}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Display;
