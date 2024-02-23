import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

function AdminAuthRoute() {

  const navigate = useNavigate()
  const user = useSelector((state) => state.logUser.user);
  
  useEffect(() => {
    if (!user) {
      navigate('/')
    } else if (user?.role === "user") {
      navigate('/user')
    } 
  
  }, [user])

  return <Outlet />;
  
}

export default AdminAuthRoute;
