import React from 'react';

const MessageItem = ({ owner, owner_id, ownerAvatar, sender, sender_id, senderAvatar, content, recipient, recipientAvatar }) => {
  const messagePosition = owner_id === sender_id ? 'chatApp__convMessageItem--right' : 'chatApp__convMessageItem--left';
  const messageSender = owner_id === sender_id ? owner : recipient;
  const messageSenderAvatar = owner_id === sender_id ? ownerAvatar : recipientAvatar;
  

  return (
    <div className={`chatApp__convMessageItem ${messagePosition} clearfix`}>
      <img src={messageSenderAvatar} alt={messageSender} className="chatApp__convMessageAvatar" />
      <div className="chatApp__convMessageValue" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default MessageItem;
