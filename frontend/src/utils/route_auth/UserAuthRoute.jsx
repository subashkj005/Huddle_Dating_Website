import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function UserAuthRoute() {
  const user = useSelector((state) => state.logUser.user);

  if (!user) {
    return <Navigate to="/" />;
  } else if (user.role === "admin") {
    return <Navigate to="/admin" />;
  }

  return <Outlet />;
}

export default UserAuthRoute;
