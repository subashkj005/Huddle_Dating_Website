import React, { useState } from "react";
import axiosInstance from "../../../../axios/axiosInstance";
import { ADMIN_USER_ACCESS } from "../../../../constants/admin_urls";
import { useNavigate } from "react-router-dom";
import { Avatar, Button } from "@nextui-org/react";
import useravatar from '../../../../assets/images/avatar.jpg'
import { useDispatch, useSelector } from "react-redux";
import { IMAGE_URL } from "../../../../constants/urls";

function UsersTab() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState([]);
  const [skelton, setSkelton] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate()

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNumber(1);
    console.log(ADMIN_USER_ACCESS);
  };

  const viewUser = (userId) => {
    navigate(`/admin/user/${userId}`)
  }

  const searchUsers = () => {
    setSkelton(true);
    const data = { key: search, page_number: pageNumber };

    axiosInstance
      .post(`${ADMIN_USER_ACCESS}/search_users/${pageNumber}`, data)
      .then((res) => {
        console.log(res);
        setUsers(res?.data?.users);
        // dispatch(storeUsers(res?.data));
      })
      .catch((err) => {
        console.log(err, "user_err_response");
      })
      .finally(() => {
        setSkelton(false);
      });
  };

  return (
    <>
      <div className="mb-4 flex ">
        <input
          type="text"
          placeholder="Search Users"
          value={search}
          onChange={handleSearch}
          className="h-14 rounded-md border border-gray-300 focus:border-zinc-100"
        />
        <Button onClick={searchUsers} className="w-10 ml-6 mt-2">
          Search
        </Button>
      </div>
      <div className="flex w-full overflow-x-auto">
        <table className="table-hover table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {skelton && (
              <>
                <td class="animate-pulse">
                  <div class="h-8 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-200 mb-6 mx-4 rounded"></div>
                </td>
                <td class="animate-pulse">
                  <div class="h-8 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-200 mb-6 mx-4 rounded"></div>
                </td>
                <td class="animate-pulse">
                  <div class="h-8 p-2 bg-gray-200 mt-3 mx-4 mb-6 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-300 mb-6 mx-4 rounded"></div>
                  <div class="h-8 p-2 bg-gray-200 mb-6 mx-4 rounded"></div>
                </td>
              </>
            )}

            {!skelton &&
              users &&
              users.map((user, index) => (
                <tr key={index} onClick={()=>viewUser(user?.id)}>
                  <td>{index + 1}</td>
                  <td className="flex items-center">
                  <Avatar
                  className="mr-3"
                  size="md"
                  src={
                    user?.profile_picture
                      ? user.profile_picture.startsWith("http")
                        ? user.profile_picture
                        : `${IMAGE_URL}${user.profile_picture}`
                      : useravatar
                  }
                />
                    {user.name ? user.name : "User"}
                  </td>
                  <td>
                    {user.is_active ? (
                      <button className="btn btn-solid-success">Active</button>
                    ) : (
                      <button className="btn btn-solid-error">
                        Deactivated
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!skelton && users.length == 0 && (
            <div className="flex justify-center items-center w-full h-full p-10">
              <h1 className="font-medium text-xl">No reports </h1>
            </div>
          )}
    </>
  );
}

export default UsersTab;
