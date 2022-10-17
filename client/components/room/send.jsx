import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Picker from 'emoji-picker-react';

import style from '../../styles/components/room/send.css';

import socket from '../../helpers/socket';

function Send({
  foreign,
}) {
  const { room, user, darkmode } = useSelector((state) => state);

  const [formbody, setFormbody] = useState({
    message: '',
    reply: '',
  });

  const [sendIcon, setSendIcon] = useState(false);
  const [emojiTabIsOpen, setEmojiTabIsOpen] = useState(false);

  const handleChange = (event) => {
    setFormbody((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    

    if (formbody.message.length !== 0) {
      socket.emit('chat/add', {
        socketId: socket.id,
        roomId: room.data.roomId,
        reply: formbody.reply,
        message: formbody.message,
        from: {
          userId: user.userId,
          avatar: user.photo.avatar,
          profileName: user.profileName,
          username: user.username,
        },
        to: {
          userId: foreign.foreignId,
          avatar: foreign.avatar,
          profileName: foreign.profileName,
          username: foreign.username,
        },
      });

      setEmojiTabIsOpen(false);

      setFormbody((prev) => ({
        ...prev, message: '', reply: '',
      }));
    }
  }

  const handleSelectEmoji = (event, object) => {
    event.preventDefault();

    setFormbody((prev) => ({
      ...prev,
      message: prev.message + object.emoji,
    }));
  }

  useEffect(() => {
    if (formbody.message.length > 0) {
      setSendIcon(true);
    } else {
      setSendIcon(false);
    }
  }, [
    formbody.message,
  ]);

  return (
    <div
      className={`${style.send} ${darkmode ? style.dark : null}`}
    >
      {
        emojiTabIsOpen
          ? (
            <div className={style.emoji}>
              <span className={style.strip}></span>
              <Picker
                onEmojiClick={handleSelectEmoji}
                pickerStyle={{
                  width: '100%',
                  height: '200px',
                  background: 'transparent',
                  border: 'none',
                  boxShadow: 'none',
                }}
                groupVisibility={{
                  flags: false,
                  objects: false,
                  symbols: false,
                }}
                groupNames={{
                  smileys_people: '',
                  animals_nature: '',
                  food_drink: '',
                  travel_places: '',
                  activities: '',
                  objects: '',
                  symbols: '',
                  flags: '',
                  recently_used: '',
                }}
                disableSearchBar
                disableAutoFocus
              />
            </div>
          ) : null
      }
      <form
        method="post"
        className={style['send-wrap']}
        onSubmit={handleSubmit}
      >
        <button
          type="button"
          className={`${style.btn} ${emojiTabIsOpen ? style.active : null}`}
          onClick={() => setEmojiTabIsOpen(!emojiTabIsOpen)}
        >
          <box-icon name="smile" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
        </button>
        <div className={style['control-wrap']}>
          <textarea
            name="message"
            className={style['form-control']}
            placeholder="Type Message..."
            autoComplete="off"
            value={formbody.message}
            onChange={handleChange}
          >
          </textarea>
        </div>
        {
          sendIcon ? (
            <button
              type="submit"
              className={style.btn}
            >
              <box-icon name="send" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            </button>
          ) : (
            <div className={style['not-send']}>
              <button
                type="button"
                className={style.btn}
              >
                <box-icon name="paperclip" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
              </button>
              <button
                type="button"
                className={style.btn}
              >
                <box-icon type="solid" name="microphone-alt" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
              </button>
            </div>
          )
        }
      </form>
    </div>
  );
}

export default Send;
