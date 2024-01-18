import React, { useEffect, useState } from "react";
import axiosInstance from "../../../../axios/axiosInstance";
import { ADMIN_URL } from "../../../../constants/admin_urls";
import { useDispatch, useSelector } from "react-redux";
import {storeUsers} from '../../../../redux/slices/admin/usersLoadSlice'


function UsersTab() {
  const [users, setUsers] = useState([]);
  const stored_users = useSelector((state)=> state.loadUser)
  const dispatch = useDispatch()
  
  
  useEffect(() => {

    axiosInstance
      .get(`${ADMIN_URL}/users/`)
      .then((res) => {
        setUsers(res?.data);
		dispatch(storeUsers(res?.data))
      })
      .catch((err) => {
        console.log(err, "user_err_response");
      })
      .finally(() => {});
  }, []);

  return (
    <>
      <div className="mb-4 ">
        .
        <input
          type="text"
          placeholder="Search Users"
          className="h-14 rounded-md border border-gray-300 focus:border-zinc-100"
        />
        <div></div>
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
            {users &&
              users.map((user, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{user.name ? user.name : "User"}</td>
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
    </>
  );
}

export default UsersTab;
