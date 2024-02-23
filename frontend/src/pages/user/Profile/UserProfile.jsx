import React, { useState, useContext, useEffect } from "react";
import ImageUpload from "../../../components/imageUpload/ImageUpload";
import { createFormData } from "../../../utils/fileManagement/fileUpload";
import axiosInstance from "../../../axios/axiosInstance";
import { IMAGE_URL, USERS_URL } from "../../../constants/urls";
import { toast } from "react-toastify";
import { toast as hottoast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import {
  RiAddLine,
  RiArrowDownSFill,
  RiPencilLine,
  RiCloseCircleLine,
  RiCheckLine,
} from "@remixicon/react";
import { LoadingContext } from "../../../context/LoadingContext";
import { useSelector } from "react-redux";
import validateImage from "../../../utils/fileManagement/imageValidations";
import ProfilePictureModal from "../../../components/modals/ProfilePictureModal";
import { UserPictureContext } from "../../../context/UserPictureContext";

function UserProfile() {
  const { showLoading, hideLoading } = useContext(LoadingContext);
  const { handleFetch } = useContext(UserPictureContext)
  const user_id = useSelector((state) => state.logUser.user.id);

  const [modalOpen, setModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [formData, setFormData] = useState({});
  const [prompts, setPrompts] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesLink, setImagesLink] = useState([]);
  const [profile_picture, setProfilePicture] = useState(null);
  const [profileLink, setProfileLink] = useState(null);
  const [tempPrompt, setTempPrompt] = useState("");
  const [isPromptEdit, setIsPromptEdit] = useState(false);
  const [editingPromptId, setEditingPromptId] = useState(null);


  const updateAvatar = (image) => {
    setProfilePicture(image);
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files[0];
    const validation = validateImage(file);

    if (!validation.valid) {
      toast.warning(validation.message);
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(file);
        setProfileLink(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (event, index) => {
    const file = event.target.files[0];
    const validation = validateImage(file);

    if (!validation.valid) {
      toast.warning(validation.message);
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        const newImagesLink = [...imagesLink];

        if (index !== undefined && index !== null) {
          newImages[index].image = file;
          newImagesLink[index] = reader.result;
        } else {
          const newImage_obj = { id: uuidv4(), image: file };
          newImages[newImages.length] = newImage_obj;
          newImagesLink[newImagesLink.length] = reader.result;
        }

        setImages(newImages);
        setImagesLink(newImagesLink);
        console.log(images, "images");
      };
      reader.readAsDataURL(file);
    }
    console.log(imagesLink, "imagesLink");
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      const prevWorks = prevData.works || [];

      if (name === "title" || name === "company") {
        console.log("getting inside checking function");
        return {
          ...prevData,
          works: [
            {
              title:
                name === "title"
                  ? value
                  : prevWorks[0]?.title || data.works.title || "",
              company:
                name === "company"
                  ? value
                  : prevWorks[0]?.company || data.works.company || "",
            },
          ],
        };
      } else {
        return {
          ...prevData,
          [name]: value,
        };
      }
    });

    console.log("formdata updated = ", formData);
  };

  const editPrompt = (prompt, index) => {
    setTempPrompt(prompt);
    setIsPromptEdit(true);
    setEditingPromptId(index);
  };

  const addPrompt = () => {
    if (prompts.length == 3) {
      toast.warning("Maximum prompts reached");
      setTempPrompt("");
      console.log(prompts, "prompts");
      return;
    }
    const trimmedValue = String(tempPrompt).trim();
    if (trimmedValue === "" || tempPrompt == null) {
      return false;
    }
    prompts.push({ prompt: tempPrompt });
    setFormData((prevData) => ({ ...prevData, prompts: prompts }));
    setTempPrompt("");
    console.log("FORMDATA ==", formData);
  };

  const updatePrompt = (index) => {
    const updatedPrompts = prompts.map((item, i) =>
      i === index ? { ...item, prompt: tempPrompt.prompt } : item
    );

    setPrompts(updatedPrompts);
    setFormData((prevData) => ({ ...prevData, prompts: updatedPrompts }));
    setIsPromptEdit(false);
    setEditingPromptId(null);
    console.log("FORMDATA ==", formData);
  };

  const deletePrompt = (index) => {
    setPrompts((prevPrompts) => prevPrompts.filter((item, i) => i !== index));
    setFormData((prevData) => ({ ...prevData, prompts: prompts }));
    toast.success("Prompt deleted successfully");
    console.log("FORMDATA ==", formData);
  };

  const handleSubmit = () => {

    let data = createFormData(
      { ...formData, prompts, profile_picture },
      images
    );

    showLoading();

    const promise = axiosInstance.post(
      `http://localhost:7614/users/profileupdate/?user_id=${user_id}`,
      data
    );
    
    promise
    .then((res)=>{
      console.log('res from profile update => ', res)
    })
    hottoast.promise(
      promise,
      {
        loading: "Updating profile...",
        success: "Updated successfully",
        error: "Unable to update profile",
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 3000,
          icon: "✅",
        },
        timeout: 5000,
      }
    );

    promise
      .catch((err) => {
        console.log("ERR ===>\n", err);
      })
      .finally(() => {
        hideLoading();
        handleFetch()
      });
  };

  useEffect(() => {
    showLoading();

    axiosInstance
      .get(`${USERS_URL}/get_user_details/${user_id}`)
      .then((res) => {
        setData(res.data);
        setPrompts(res.data.prompts);
        setImages(res.data.gallery);

        if (res?.data?.user?.profile_picture) {
          localStorage.setItem(`${user_id}profile_picture`, res?.data?.user?.profile_picture)
        }

        console.log(res, "SUCCESS");
      })
      .catch((err) => {
        console.log(err, "err");
      })
      .finally(() => {
        hideLoading();
        console.log(formData, "formdata");
      });
  }, []);

  return (
    <>
      {modalOpen && (
        <ProfilePictureModal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
        />
      )}

      <div className="mx-auto lg:w-[70%] ">
        <div className="flex flex-col lg:flex-row ">
          <div className="lg:w-[40%] w-full mt-5 mb-5">
            <div className="mb-3">
              <label htmlFor="" className="flex ml-3">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="name"
                value={formData?.name ? formData.name : data?.user.name}
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Phone number
              </label>
              <input
                type="text"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="phone_number"
                value={
                  formData?.phone_number
                    ? formData.phone_number
                    : data?.user.phone_number
                }
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Date of birth <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="date_of_birth"
                value={data?.user.date_of_birth}
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Gender <span className="text-red-600">*</span>
              </label>
              <select
                className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="gender"
                value={formData?.gender ? formData.gender : data?.user.gender}
                onChange={handleValueChange}
              >
                <option value="">Choose</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Interested in <span className="text-red-600">*</span>
              </label>
              <select
                className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="interested_in"
                value={
                  formData?.interested_in
                    ? formData.interested_in
                    : data?.user.interested_in
                }
                onChange={handleValueChange}
              >
                <option value="">Choose</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Educational Level
              </label>
              <select
                className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="education_level"
                value={
                  formData?.education_level
                    ? formData.education_level
                    : data?.user.education_level
                }
                onChange={handleValueChange}
              >
                <option value="">Choose</option>
                <option value="High School">High School</option>
                <option value="Trade / Tech">Trade / Tech</option>
                <option value="Incollege">In college</option>
                <option value="Diploma">Diploma</option>
                <option value="Graduate">Graduate</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Height
              </label>
              <input
                type="number"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="height"
                value={formData?.height ? formData.height : data?.user.height}
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Weight
              </label>
              <input
                type="number"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="weight"
                value={formData?.weight ? formData.weight : data?.user.weight}
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="" className="flex ml-3 ">
                Location
              </label>
              <input
                type="text"
                className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                name="location"
                value={
                  formData?.location ? formData.location : data?.user.location
                }
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2 ">
              <div className="accordion-group border border-slate-300 rounded">
                <div className="accordion">
                  <input
                    type="checkbox"
                    id="accordion-1"
                    className="accordion-toggle"
                  />
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="accordion-1"
                      className="accordion-title text-base font-normal ml-2"
                    >
                      Interests
                    </label>
                    <RiArrowDownSFill className="mr-4" size={30} />
                  </div>
                  <div className="accordion-content">
                    <div className="min-h-0">
                      <div className="mr-1 ml-4 mb-2">
                        <label htmlFor="" className="flex ml-3">
                          Workout
                        </label>
                        <select
                          className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                          name="workout"
                          value={
                            formData?.workout
                              ? formData.workout
                              : data?.interests.workout
                          }
                          onChange={handleValueChange}
                        >
                          <option value="">Choose</option>
                          <option value="Active">Active</option>
                          <option value="Sometimes">Sometimes</option>
                          <option value="Almost">Almost</option>
                          <option value="Never">Never</option>
                        </select>
                      </div>
                      <div className="mr-1 ml-4 mb-2">
                        <label htmlFor="" className="flex ml-3">
                          Drinks
                        </label>
                        <select
                          className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                          name="drinks"
                          value={
                            formData?.drinks
                              ? formData.drinks
                              : data?.interests.drinks
                          }
                          onChange={handleValueChange}
                        >
                          <option value="">Choose</option>
                          <option value="Frequently">Frequently</option>
                          <option value="Socially">Socially</option>
                          <option value="Rarely">Rarely</option>
                          <option value="Never">Never</option>
                        </select>
                      </div>
                      <div className="mr-1 ml-4 mb-2">
                        <label htmlFor="" className="flex ml-3">
                          Smoking
                        </label>
                        <select
                          className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                          name="smoking"
                          value={
                            formData?.smoking
                              ? formData.smoking
                              : data?.interests.smoking
                          }
                          onChange={handleValueChange}
                        >
                          <option value="">Choose</option>
                          <option value="Frequently">Frequently</option>
                          <option value="Socially">Socially</option>
                          <option value="Rarely">Rarely</option>
                          <option value="Never">Never</option>
                        </select>
                      </div>
                      <div className="mr-1 ml-4 mb-2">
                        <label htmlFor="" className="flex ml-3">
                          What are you looking in dating?
                        </label>
                        <select
                          className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                          name="dating_purpose"
                          value={
                            formData?.dating_purpose
                              ? formData.dating_purpose
                              : data?.interests.dating_purpose
                          }
                          onChange={handleValueChange}
                        >
                          <option value="">Choose</option>
                          <option value="Relationship">Relationship</option>
                          <option value="Something Casual">
                            Something Casual
                          </option>
                          <option value="Don't know right now">
                            Don't know right now
                          </option>
                          <option value="Marriage">Marriage</option>
                        </select>
                      </div>
                      <div className="mr-1 ml-4 mb-2">
                        <label htmlFor="" className="flex ml-3">
                          Zodiac Sign
                        </label>
                        <select
                          className="select bg-transparent focus:border-[hsl(332,100%,85%)]"
                          name="zodiac_sign"
                          value={
                            formData?.zodiac_sign
                              ? formData.zodiac_sign
                              : data?.interests.zodiac_sign
                          }
                          onChange={handleValueChange}
                        >
                          <option value="">Choose</option>
                          <option value="Aries">Aries</option>
                          <option value="Taurus">Taurus</option>
                          <option value="Gemini">Gemini</option>
                          <option value="Cancer">Cancer</option>
                          <option value="Leo">Leo</option>
                          <option value="Virgo">Virgo</option>
                          <option value="Libra">Libra</option>
                          <option value="Scorpio">Scorpio</option>
                          <option value="Sagittarius">Sagittarius</option>
                          <option value="Capricorn">Capricorn</option>
                          <option value="Aquarius">Aquarius</option>
                          <option value="Pisces">Pisces</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <button
                className="btn bg-[#fa9ac7e9] text-[#b3346f] hover:bg-pink-400 hover:text-white"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
          <div className=" lg:w-[60%] lg:ml-5">
            <div className="my-2 mt-4">
              <h3 className="mb-4">Profile Picture</h3>
              {profile_picture || data?.user.profile_picture ? (
                <label>
                  <img
                    className=" h-[40%] w-[30%] rounded-xl shadow-[14px_4px_20px_0px_#cfcfcf]"
                    onClick={() => setModalOpen(true)}
                    src={
                      profile_picture
                        ? URL.createObjectURL(profile_picture)
                        : `${IMAGE_URL}${data?.user.profile_picture}`
                    }
                  />
                </label>
              ) : (
                <label
                  className="p-10 bg-[rgb(233,233,233)] flex items-center
                             justify-center rounded-xl outline-3 outline-[#fd7ab7]
                             outline-dashed text-[#fc449a] text-center text-2xl
                             font-extrabold"
                  onClick={() => setModalOpen(true)}
                >
                  +
                </label>
              )}
            </div>
            <div className="my-4">
              <h3 className="mb-4">Gallery</h3>
              <div className="grid grid-cols-3 gap-12 mt-1">
                {images.length > 0 ? (
                  <label>
                    <img
                      className="rounded-xl outline-3 outline-slate-400 outline-dashed shadow-[14px_4px_20px_0px_#cfcfcf]"
                      src={
                        images[0] && typeof images[0].image !== "string"
                          ? URL.createObjectURL(images[0].image)
                          : `${IMAGE_URL}${images[0].image}`
                      }
                    />
                    <input
                      type="file"
                      name="gallery"
                      className="input-file hidden cursor-pointer"
                      onChange={(event) => handleGalleryImageChange(event, 0)}
                    />
                  </label>
                ) : (
                  <ImageUpload
                    handleImageChange={handleGalleryImageChange}
                    name="gallery"
                  />
                )}
                {images.length > 1 ? (
                  <label>
                    <img
                      className="rounded-xl outline-3 outline-slate-400 outline-dashed shadow-[14px_4px_20px_0px_#cfcfcf]"
                      src={
                        images[1] && typeof images[1].image !== "string"
                          ? URL.createObjectURL(images[1].image)
                          : `${IMAGE_URL}${images[1].image}`
                      }
                    />
                    <input
                      type="file"
                      name="gallery"
                      className="input-file hidden cursor-pointer"
                      onChange={(event) => handleGalleryImageChange(event, 1)}
                    />
                  </label>
                ) : (
                  <ImageUpload
                    handleImageChange={handleGalleryImageChange}
                    name="gallery"
                  />
                )}
                {images.length > 2 ? (
                  <label>
                    <img
                      className="rounded-xl outline-3 outline-slate-400 outline-dashed shadow-[14px_4px_20px_0px_#cfcfcf]"
                      src={
                        images[2] && typeof images[2].image !== "string"
                          ? URL.createObjectURL(images[2].image)
                          : `${IMAGE_URL}${images[2].image}`
                      }
                    />
                    <input
                      type="file"
                      name="gallery"
                      className="input-file hidden cursor-pointer"
                      onChange={(event) => handleGalleryImageChange(event, 2)}
                    />
                  </label>
                ) : (
                  <ImageUpload
                    handleImageChange={handleGalleryImageChange}
                    name="gallery"
                  />
                )}
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="" className="flex ml-3">
                Bio
              </label>
              <textarea
                type="text"
                className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg focus:border-pink-400 overflow-hidden"
                name="bio"
                value={formData?.bio ? formData.bio : data?.user.bio}
                placeholder="Bio"
                onChange={handleValueChange}
              />
            </div>
            <div className="mb-2">
              <div className="accordion-group border border-slate-300 rounded">
                <div className="accordion">
                  <input
                    type="checkbox"
                    id="accordion-2"
                    className="accordion-toggle"
                  />
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="accordion-2"
                      className="accordion-title text-base font-normal ml-2"
                    >
                      Work
                    </label>
                    <RiArrowDownSFill className="mr-4" size={30} />
                  </div>
                  <div className="accordion-content">
                    <div className="min-h-0 flex justify-center items-center">
                      <div className="mr-1">
                        <label htmlFor="" className="flex ml-3">
                          Title
                        </label>
                        <input
                          type="text"
                          className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                          name="title"
                          value={
                            formData?.works
                              ? formData?.works[0]?.title
                              : data?.works.title
                          }
                          onChange={handleValueChange}
                        />
                      </div>
                      <div className="ml-1">
                        <label htmlFor="" className="flex ml-3">
                          Company
                        </label>
                        <input
                          type="text"
                          className="input bg-transparent focus:border-[hsl(332,100%,85%)]"
                          name="company"
                          value={
                            formData?.works
                              ? formData?.works[0]?.company
                              : data?.works.company
                          }
                          onChange={handleValueChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-2 mt-6">
              <div>
                <label htmlFor="" className="flex ml-3">
                  Prompts
                </label>
                <div className="flex">
                  <textarea
                    type="text"
                    className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg focus:border-pink-400 overflow-hidden"
                    name="tempPrompt"
                    value={tempPrompt}
                    onChange={(e) => setTempPrompt(e.target.value)}
                  />
                  <div
                    className="p-2 bg-[#fc449a] m-4 rounded-full"
                    onClick={addPrompt}
                  >
                    <RiAddLine size={32} />
                  </div>
                </div>

                {prompts.map((item, index) => (
                  <div className="flex border border-slate-300 rounded-md my-3">
                    {isPromptEdit && editingPromptId === index ? (
                      <input
                        className="w-full bg-[#da7272] border-none rounded-md my-4 p-2 ml-2 text-sm"
                        key={index}
                        type="text"
                        value={tempPrompt.prompt}
                        onChange={(e) =>
                          setTempPrompt({
                            ...tempPrompt,
                            prompt: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div
                        key={index}
                        className="w-full bg-[#e9e9e9] rounded-md my-4 p-2 ml-2 text-sm"
                      >
                        {item.prompt}
                      </div>
                    )}
                    <div className="m-2">
                      {isPromptEdit && editingPromptId === index ? (
                        <div
                          className="bg-blue-200 w-8 h-8 flex items-center justify-center rounded m-1"
                          onClick={() => updatePrompt(index)}
                        >
                          <RiCheckLine size={18} />
                        </div>
                      ) : (
                        <div
                          className="bg-blue-200 w-8 h-8 flex items-center justify-center rounded m-1"
                          onClick={() => editPrompt(item, index)}
                        >
                          <RiPencilLine size={18} />
                        </div>
                      )}
                      <div
                        className="bg-red-400 w-8 h-8 flex items-center justify-center rounded m-1"
                        onClick={() => deletePrompt(index)}
                      >
                        <RiCloseCircleLine size={18} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
