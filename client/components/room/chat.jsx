import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import style from '../../styles/components/room/chat.css';

import socket from '../../helpers/socket';

function Chat() {
  const { room, user, darkmode } = useSelector((state) => state);

  const [chats, setChats] = useState([]);

  const handleGetChats = () => {
    socket.emit('chat/get', {
      foreignId: room.data.foreignId,
      userId: user.userId,
      roomId: room.data.roomId,
    });

    socket.on('chat/get/callback', (args) => {
      if (!args.success) {
        setChats([]);
      } else {
        setChats(args.data);
      }
    });
  }

  const formatTime = (args) => {
    const displayTime = new Date(args).toLocaleTimeString([], {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
    return displayTime;
  }

  const Condition = ({ condition }) => {
    if (condition === 'read') {
      return (
        <span
          className={style['condition-icon']}
        >
          <box-icon
            name="check-double"
            color={darkmode ? '#00A19D' : '#00A19D'}
          >
          </box-icon>
        </span>
      );
    }

    return (
      <span
        className={style['condition-icon']}
      >
        <box-icon
          name="check-double"
          color={darkmode ? '#ffffffdd' : '#000000dd'}
        >
        </box-icon>
      </span>
    );
  }

  useEffect(() => {
    const parent = document.getElementsByClassName(style.chat)[0];
    parent.scrollTop = parent.scrollHeight;

    handleGetChats();

    if (room.active) {
      if (chats.length > 0) {
        if (
          chats[chats.length - 1].roomId === room.data.roomId
          && chats[chats.length - 1].from !== user.userId
        ) {
          socket.emit('chat/read', {
            socketId: socket.id,
            userId: user.userId,
            foreignId: room.data.foreignId,
            roomId: room.data.roomId,
          });
        }
      }
    }
  }, [
    room, chats.length,
  ]);

  return (
    <div
      className={`${style.chat} ${darkmode ? style.dark : null}`}
    >
      {
        chats.length !== 0 && (
          chats.map((item) => (
            <div
              className={`${style.cards} ${item.from === user.userId ? style['is-user'] : style['is-not-user']}`}
              key={item._id}
            >
              <span className={style.tip}></span>
              <div className={style.message}>
                <p className={style.text}>{item.message}</p>
                <div className={style.info}>
                  <p className={style.time}>{formatTime(item.createdAt)}</p>
                  {
                    item.from === user.userId
                    && (
                      <Condition
                        condition={item.condition}
                      />
                    )
                  }
                </div>
              </div>
            </div>
          ))
        )
      }
    </div>
  );
}

export default Chat;
