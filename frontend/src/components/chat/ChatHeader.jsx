import React from 'react'

function ChatHeader({recipientAvatar, recipient}) {
  return (
    <div className='chatApp__Header'>
        <img src={recipientAvatar} alt="" className='chatApp__HeaderAvatar' />
        <h3 className='chatApp__HeaderName'>{recipient}</h3>
    </div>
  )
}

export default ChatHeader