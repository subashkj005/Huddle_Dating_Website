import { io } from "socket.io-client";
import { USER_SOCKET } from "../constants/urls";


export const socket = io(USER_SOCKET);

const userId = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user")).id
  : null;

export async function socketConnection() {
  if (userId) {
    socket.on("connect", async () => {
      socket.emit("add_user_connection", { 'user_id':userId });
    });

    console.log('Socket connetion sent to backend')

  }
}