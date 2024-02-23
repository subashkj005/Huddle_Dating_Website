import React, { useContext } from "react";
import logo from "../../assets/images/logo_png_hd-cropped.png";
import avatar from "../../assets/images/avatar.jpg";
import { IoIosNotifications } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { loggedOut } from "../../redux/slices/logSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { IMAGE_URL } from "../../constants/urls";
import { UserPictureContext } from "../../context/UserPictureContext";

function BasicNavbar({ image }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userImage, name, setUserImage, setName } = useContext(UserPictureContext)
  const { id } = useSelector((state) => state?.logUser?.user);
  const notificationCount = 10;
  const signoutPrompts = [
    "Ready to sign out? Or perhaps there's another profile waiting for your attention? 💌",
    "Thinking of signing out? Explore a bit more! 💎",
    "Are you sure you want to leave? There might be a match waiting for you! 🎉",
    "Ready to sign out? Or see another profile? 👀",
  ];

  const randomIndex = Math.floor(Math.random() * signoutPrompts.length);

  const currentUrl = location.pathname;
  

  const logoutUser = () => {
    dispatch(loggedOut());
    setName(null)
    setUserImage(null)
    navigate("/");
  };

  return (
    <>
      <div className="navbar rounded-lg">
        <div className="navbar-start">
          <Link className="navbar-item" to="/user">
            <img src={logo} style={{ width: "7rem" }} alt="logo" />
          </Link>
        </div>
        <div className="navbar-end flex items-center">
          <div className="px-3 ">
            <ul className="flex items-center gap-4">
              <Link to="/user">
                <li className={`p-2 m-2  text-center rounded-[10px] hover:bg-gradient-to-r from-purple-300 to-pink-300 text-pink-500 hover:text-white font-sans font-semibold ${ currentUrl === '/user' ? 'border-b-2 border-pink-400' : ""}`}>
                  Home
                </li>
              </Link>
              <Link to="/user/feeds">
                <li className={`p-2 m-2  text-center rounded-[10px] hover:bg-gradient-to-r from-purple-300 to-pink-300 text-pink-500 hover:text-white font-sans font-semibold ${ currentUrl === '/user/feeds' ? 'border-b-2 border-pink-400' : ""}`}>
                  Feeds
                </li>
              </Link>
              <Link to="/user/profile">
                <li className={`p-2 m-2  text-center rounded-[10px] hover:bg-gradient-to-r from-purple-300 to-pink-300 text-pink-500 hover:text-white font-sans font-semibold ${ currentUrl === '/user/profile' ? 'border-b-2 border-pink-400' : ""}`}>
                  Profile
                </li>
              </Link>
            </ul>
          </div>
          {/* Notification bell icon with dropdown */}
          <div className="dropdown-container mr-2">
            <div className="dropdown">
              <label
                className="btn btn-ghost flex cursor-pointer px-0"
                tabIndex="0"
              >
                {/* Add your notification bell icon here */}

                <span className="material-icons opacity-0">
                  {notificationCount > 0 && (
                    <span className="absolute -mt-1 ml-1 rounded-full bg-[#fb5ba5] px-1 text-white text-[0.7rem]">
                      10
                    </span>
                  )}
                  <IoIosNotifications size={30} color="#ca8bff" />
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
                      src={
                        userImage
                          ? userImage
                          : avatar
                      }
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
              <button className="btn btn-block ">Cancel</button>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

export default BasicNavbar;
