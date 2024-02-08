import React from 'react';
import MessageItem from '../../components/chat/MessageItem'

const MessageList = ({ messages, owner, ownerAvatar, owner_id, recipient, recipientAvatar }) => {
  
  return (
    <div className="chatApp__convTimeline">
      {messages.slice(0).reverse().map((messageItem) => (
        <MessageItem
          key={messageItem.id}
          owner={owner}
          owner_id={owner_id}
          ownerAvatar={ownerAvatar}
          sender_id={messageItem.sender_id}
          sender={messageItem.sender}
          senderAvatar={messageItem.senderAvatar}
          content={messageItem.content} 
          recipient={recipient} 
          recipientAvatar={recipientAvatar}
        />
      ))}
    </div>
  );
};

export default MessageList;
