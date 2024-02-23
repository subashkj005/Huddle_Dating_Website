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
  const [isTyping, setIsTyping] = useState({});
  const socket = useRef();
  const user = useSelector((state) => state.logUser.user);
  const chatDetails = useSelector((state) => selectMatchById(state, chatName));
  const profilePicture = localStorage.getItem(`${user?.id}profile_picture`)
    ? localStorage.getItem(`${user?.id}profile_picture`)
    : null;

    console.log('isTyping => ', isTyping)

  useEffect(() => {
    socket.current = io(CHAT_SOCKET);
    console.log('getting messages')
    axiosInstance
      .get(`${CHAT_URL}/get_messages/${chatName}`)
      .then((res) => {
        setMessages(res.data.messages);
        console.log('chat res = ', res)
      })
      .catch((err) => {
        console.error("chat err ==>", err);
      })
      .finally(() => {});


    socket.current.on("connect", () => {

      socket.current.emit("add_user_connection", { user_id: user?.id });

      socket.current.emit("join_room", { room_name: chatName, user_id: user?.id });
    });

    socket.current.on("recieve_message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message.message]);
      console.log('message getting as response => ', message)

    });

    socket.current.on('set_typing', (data) => {
      setIsTyping({ ...isTyping, [data.owner]: true })
    })
  
    socket.current.on('reset_typing', (data) => {
      setIsTyping({ ...isTyping, [data.owner]: false })
    })


    return () => {
      
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
        isTyping={isTyping}
        setIsTyping={setIsTyping}
      />
    </>
  );
}

export default Chat;
