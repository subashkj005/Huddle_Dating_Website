import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function AdminAuthRoute() {

  const user = useSelector((state) => state.logUser.user);
  if (!user) {
    <Navigate to="/" />;
  } else if (user.role === "user") {
    <Navigate to="/user" />;
  } else {
    return <Outlet />;
  }

}

export default AdminAuthRoute;
