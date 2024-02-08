import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import ChatBox from "../../../components/chat/ChatBox";
import { useParams } from "react-router-dom";
import axiosInstance from "../../../axios/axiosInstance";
import { CHAT_URL, CHAT_SOCKET } from "../../../constants/urls";
import { useSelector } from "react-redux";
import { selectMatchById } from "../../../redux/slices/chatListSlice";

// SocketIO

function Chat() {
  const { chatName } = useParams();
  const [messages, setMessages] = useState([]);
  const socket = useRef();
  const user = useSelector((state) => state.logUser.user);
  const chatDetails = useSelector((state) => selectMatchById(state, chatName));
  const profilePicture = localStorage.getItem(`${user?.id}profile_picture`)
    ? localStorage.getItem(`${user?.id}profile_picture`)
    : null;

  useEffect(() => {
    socket.current = io(CHAT_SOCKET);

    axiosInstance
      .get(`${CHAT_URL}/get_messages/${chatName}`)
      .then((res) => {
        setMessages(res.data.messages);
      })
      .catch((err) => {
        console.error("chat err ==>", err);
      })
      .finally(() => {});

    socket.current.on("connect", () => {
      // Emit the `add_user_connection` event with user ID
      socket.current.emit("add_user_connection", { user_id: user?.id });

      // Join the chat room
      socket.current.emit("join_room", { room_name: chatName, user_id: user?.id });
    });

    socket.current.on("recieve_message", (message) => {
      // Update messages state with the received message
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log('message getting as response => ', message)
      console.log('messages => ', messages)
    });


    return () => {
      console.log('return working ..............')
      if (socket.current) {
        
        socket.current.emit("leave_room", { room_name: chatName, user_id: user?.id });
        socket.current.disconnect();
      }
    };
  }, [chatName, user.id, setMessages]);

  return (
    <>
      <ChatBox
        messages={messages}
        setMessages={setMessages}
        chatDetails={chatDetails}
        chatName={chatName}
        user={user}
        profilePicture={profilePicture}
        socket={socket}
      />
    </>
  );
}

export default Chat;
