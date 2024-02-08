import React from "react";
import logo from "../../assets/images/logo_png_hd-cropped.png";
import avatar from "../../assets/images/avatar.jpg";
import { IoIosNotifications } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { loggedOut } from "../../redux/slices/logSlice";
import { useNavigate, Link } from "react-router-dom";
import { IMAGE_URL } from "../../constants/urls";


function BasicNavbar({ image }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name, id } = useSelector((state) => state?.logUser?.user);
  const notificationCount = 10;
  const profilePicture = localStorage.getItem(`${id}profile_picture`)?localStorage.getItem(`${id}profile_picture`):null
  const signoutPrompts = [
    "Ready to sign out? Or perhaps there's another profile waiting for your attention? 💌",
    "Thinking of signing out? Explore a bit more! 💎",
    "Are you sure you want to leave? There might be a match waiting for you! 🎉",
    "Ready to sign out? Or see another profile? 👀",
  ];

  const randomIndex = Math.floor(Math.random() * signoutPrompts.length);

  const logoutUser = () => {
    dispatch(loggedOut());
    navigate("/");
  };

  return (
    <>
      <div className="navbar rounded-lg">
        <div className="navbar-start">
          
          <Link className="navbar-item" to='/user'>
            <img src={logo} style={{ width: "7rem" }} alt="logo" />
            </Link>
        </div>
        <div className="navbar-end flex items-center">
          {/* Notification bell icon with dropdown */}
          <div className="dropdown-container">
            <div className="dropdown">
              <label
                className="btn btn-ghost flex cursor-pointer px-0"
                tabIndex="0"
              >
                {/* Add your notification bell icon here */}

                <span className="material-icons">
                  {notificationCount > 0 && (
                    <span className="absolute -mt-1 ml-1 rounded-full bg-[#fb5ba5] px-1 text-white text-[0.7rem]">
                      10
                    </span>
                  )}
                  <IoIosNotifications size={30} color="#00ccff" />
                </span>
              </label>
              <div className="dropdown-menu dropdown-menu-bottom-left">
                {/* Add your notification items here */}
                <a className="dropdown-item text-sm">Notification 1</a>
                <a tabIndex="-1" className="dropdown-item text-sm">
                  Notification 2
                </a>
                <a tabIndex="-1" className="dropdown-item text-sm">
                  Notification 3
                </a>
              </div>
            </div>
          </div>
          {/* Space between avatar and notification */}
          <div className="mx-1"></div>

          {/* User avatar and name */}
          <div className="flex items-center ">
            <div className="custom-avatar">
              <div className="dropdown-container ">
                <div className="dropdown ">
                  <label className="btn flex bg-white px-0 " tabIndex="0">
                    <img
                      src={profilePicture ? `${IMAGE_URL}${profilePicture}` : avatar}
                      alt="avatar"
                      style={{ height: "100%" }}
                      className="rounded-full"
                    />
                    <span className="ml-2 text-sm ">{name}</span>
                  </label>
                  <div className="dropdown-menu dropdown-menu-bottom-left">
                    <Link to="/user/profile" className="dropdown-item text-sm">
                      Profile
                    </Link>
                    <label
                      tabIndex="-1"
                      type="button"
                      className="dropdown-item text-sm"
                      htmlFor="modal-3"
                    >
                      Logout
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for signout */}
      <input className="modal-state" id="modal-3" type="checkbox" />
      <div className="modal transition duration-500 -translate-y-6">
        <label className="modal-overlay"></label>
        <div className="modal-content flex flex-col gap-5">
          <label
            htmlFor="modal-3"
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
          <h2 className="text-xl">Leaving ?</h2>
          <span>{signoutPrompts[randomIndex]}</span>
          <div className="flex gap-3">
            <button className="btn btn-error btn-block" onClick={logoutUser}>
              Logout
            </button>
            <label htmlFor="modal-3" className="model-close">
              <button className="btn btn-block ">
                Cancel
              </button>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default BasicNavbar;
