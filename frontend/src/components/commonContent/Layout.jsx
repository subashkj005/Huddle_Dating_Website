import React, { useEffect } from "react";
import { io } from "socket.io-client";
import BasicNavbar from "../navbar/BasicNavbar";
import ContentArea from "../matchingSidebar/ContentArea";
import { USER_SOCKET } from "../../constants/urls";
import { useSelector } from "react-redux";

function Layout() {

  const userId = useSelector((state) => state.logUser.user.id);
  useEffect(() => {
    const socket = io(USER_SOCKET);

    socket.on("connect", async () => {
      console.log('NOTIFICATION SOCKET CONNECTED')
      socket.emit("add_user_connection", { user_id: userId });
      console.log('NOTIFICATION USER ADDED')
    });
  }, []);

  return (
    <>
      {/* Navbar */}
      <BasicNavbar />
      {/* Portion below Navbar */}
      <ContentArea />
    </>
  );
}

export default Layout;
