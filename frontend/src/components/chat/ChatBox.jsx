import React, { useState, useEffect } from "react";
import "../../assets/styles/chat.css";
import MessageList from "../../components/chat/MessageList";
import TypingIndicator from "../../components/chat/TypingIndicator";
import InputMessage from "../../components/chat/InputMessage";
import { CHAT_URL, IMAGE_URL } from "../../constants/urls";
import avatar from "../../assets/images/avatar.jpg";
import axiosInstance from "../../axios/axiosInstance";
import ChatHeader from "./ChatHeader";

const ChatBox = ({
  messages,
  setMessages,
  chatDetails,
  chatName,
  user,
  profilePicture,
  socket,
  isTyping,
  setIsTyping
}) => {
  let owner = user?.name;
  let ownerAvatar = profilePicture ? `${IMAGE_URL}${profilePicture}` : avatar;
  let owner_id = user?.id;


  const recipientAvatar =
    `${IMAGE_URL}${chatDetails?.profile_picture}` || avatar;
  const recipient = chatDetails?.name;

  

  const sendMessage = (sender, senderAvatar, content) => {
    setTimeout(() => {
      let newMessageItem = {
        sender_id: owner_id,
        chatroom: chatName,
        content: content,
        id: messages.length + 1,
      };

      resetTyping(sender);

      socket.current.emit(
        "send_message",
        { message: newMessageItem }
      );
    }, 400);
  };


  const typing = (writer) => {
    if (!isTyping[writer]) {
      setIsTyping({ ...isTyping, [writer]: true });
      
    }
  };


  const resetTyping = (writer) => {
    setIsTyping({ ...isTyping, [writer]: false });
  };

  const [isLoading, setIsLoading] = useState(false);

  const sendMessageLoading = (sender, senderAvatar, content) => {
    setIsLoading(true);
    sendMessage(sender, senderAvatar, content);

    setTimeout(() => {
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="chatApp__conv">
      <ChatHeader
      recipient={recipient}
       recipientAvatar={recipientAvatar} 
       />
      <MessageList
        owner={owner}
        ownerAvatar={ownerAvatar}
        owner_id={owner_id}
        messages={messages}
        recipient={recipient}
        recipientAvatar={recipientAvatar}
      />
      <div className="chatApp__convSendMessage clearfix">
        <TypingIndicator owner={owner} isTyping={isTyping} />
        <InputMessage
          isLoading={isLoading}
          owner={owner}
          ownerAvatar={ownerAvatar}
          sendMessage={sendMessage}
          sendMessageLoading={sendMessageLoading}
          socket={socket}
          typing={typing}
          resetTyping={resetTyping}
          isTyping={isTyping}
          roomName={chatDetails?.chatroom_name}
        />
      </div>
    </div>
  );
};

export default ChatBox;
