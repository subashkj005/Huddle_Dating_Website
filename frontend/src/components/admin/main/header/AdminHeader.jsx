import React from "react";
import { RiMenuLine, RiSearchLine, RiNotificationLine } from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";
import Admin from "../../../../assets/images/admin-avatar.jpg";
import { useDispatch } from "react-redux";
import { loggedOut } from "../../../../redux/slices/logSlice"

function AdminHeader() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutUser = () => {
    dispatch(loggedOut())
    navigate('/adminAuth')
  }

  return (
    <>
      <div className="py-2 px-4 bg-white flex items-center shadow-md shadow-black/5">
        <button type="button" className="text-lg text-gray-600">
          <RiMenuLine />
        </button>
        <ul className="flex items-center text-sm ml-4">
          <li className="mr-2">
            <Link className="text-gray-400 hover:text-gray-600 font-medium">
              Dashboard
            </Link>
          </li>
        </ul>
        <ul className="ml-auto flex items-center">
          <li className="dropdown mr-1">
            <button
              type="button"
              tabIndex="0"
              className="text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
            >
              <RiSearchLine />
            </button>
            <div className="dropdown-menu">
              <form action="" className="dropdown-item ">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search"
                    className="bg-gray-50 w-full outline-none border border-gray-100"
                  />
                </div>
              </form>
            </div>
          </li>
          <li className="mr-1">
            <button
              type="button"
              className="text-gray-400 w-8 h-8 rounded flex items-center hover:bg-gray-50 hover:text-gray-600"
            >
              <RiNotificationLine />
            </button>
          </li>
          <li className="dropdown mr-1">
            <button
              type="button"
              tabIndex="0"
              className="text-gray-400 w-8 h-8 rounded flex items-center justify-center hover:bg-gray-50 hover:text-gray-600"
            >
              <img
                className="w-8 h-8 rounded block object-cover align-middle"
                src={Admin}
                alt=""
              />
            </button>
            <div className="dropdown-menu">
              <a className="dropdown-item text-sm">Profile</a>
              <a tabIndex="-1" className="dropdown-item text-sm">
                Account settings
              </a>
              <label tabIndex="-1" className="dropdown-item text-sm" htmlFor="modal-2">
                Logout
              </label>
            </div>
          </li>
        </ul>
      </div>



      {/* Modal for signout */}
      <input className="modal-state" id="modal-2" type="checkbox" />
      <div className="modal transition duration-500 -translate-y-6">
        <label className="modal-overlay"></label>
        <div className="modal-content flex flex-col gap-5">
          <label
            htmlFor="modal-2"
            className="btn btn-sm btn-circle btn-ghost modal-close absolute right-2 top-2"
          >
            ✕
          </label>
          <h2 className="text-xl">Logout</h2>
          <span>
          Are you sure want to leave ?
          </span>
          <div className="flex gap-3">
            <button 
            className="btn btn-error btn-block"
            onClick={logoutUser}
            >Logout</button>
            <button htmlFor="modal-2" className="btn btn-block modal-close">Cancel</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
