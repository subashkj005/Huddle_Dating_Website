import React from 'react';
import { GrSend } from "react-icons/gr";

const InputMessage = ({ owner, ownerAvatar, sendMessageLoading, typing, resetTyping, isLoading, socket, isTyping, roomName }) => {
  const handleSendMessage = (event) => {
    event.preventDefault();
    const message = event.target.message.value.trim();
    if (message) {
      sendMessageLoading(owner, ownerAvatar, message);
      event.target.message.value = '';
    }
  };

  const handleTyping = (event) => {
    const message = event.target.value.trim();
    if (message) {

      if (!isTyping[owner]) {
      socket.current.emit('is_typing', {'owner': owner, 'room_name': roomName})
      }



      typing(owner);
    } else {

      socket.current.emit('finished_typing', {'owner': owner, 'room_name': roomName})

      resetTyping(owner);
    }
  };

  const loadingClass = isLoading ? 'chatApp__convButton--loading' : '';

  return (
    <form onSubmit={handleSendMessage}>
      <input type="hidden" name="owner" value={owner} />
      <input type="hidden" name="ownerAvatar" value={ownerAvatar} />
      <input
        type="text"
        name="message"
        className="chatApp__convInput"
        placeholder="Text message"
        tabIndex="0"
        onKeyDown={handleTyping}
        onKeyUp={handleTyping}
        autoComplete='off'
      />
      <button type="submit"  className={`chatApp__convButton ${loadingClass}`}>
        <GrSend size={22} />
      </button>
    </form>
  );
};

export default InputMessage;
