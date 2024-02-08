import React, { useState } from "react";
import "../../assets/styles/chat.css";
import MessageList from "../../components/chat/MessageList";
import TypingIndicator from "../../components/chat/TypingIndicator";
import InputMessage from "../../components/chat/InputMessage";
import { CHAT_URL, IMAGE_URL } from "../../constants/urls";
import avatar from "../../assets/images/avatar.jpg";
import axiosInstance from "../../axios/axiosInstance";

const ChatBox = ({
  messages,
  setMessages,
  chatDetails,
  chatName,
  user,
  profilePicture,
  socket,
}) => {
  let owner = user?.name;
  let ownerAvatar = `${IMAGE_URL}${profilePicture}` || avatar;
  let owner_id = user?.id;

  const recipientAvatar =
    `${IMAGE_URL}${chatDetails?.profile_picture}` || avatar;
  const recipient = chatDetails?.name;

  const [isTyping, setIsTyping] = useState({});

  const sendMessage = (sender, senderAvatar, content) => {
    setTimeout(() => {
      let newMessageItem = {
        sender_id: owner_id,
        chatroom: chatName,
        content: content,
        id: messages.length + 1,
      };

      // setMessages([...messages, newMessageItem]);
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
          typing={typing}
          resetTyping={resetTyping}
        />
      </div>
    </div>
  );
};

export default ChatBox;
