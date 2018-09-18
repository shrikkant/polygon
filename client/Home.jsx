import React from 'react';

import ChatroomPreview from './ChatroomPreview'
import PollStats from './PollStats'


export default ({
  chatrooms,
  onEnterChatroom,
    user,
                }) => (

    <div>

        {
            chatrooms.map(chatroom => (
                <ChatroomPreview
                    user={user}
                    key={chatroom.name}
                    chatroom={chatroom}
                    onEnter={() => onEnterChatroom(chatroom.id)}
                />
            ))
        }
    </div>

)
