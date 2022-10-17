import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import sound from '../../assets/sound/message.mp3';

import style from '../../styles/components/main/inbox.css';

import action from '../../redux/actions/selectedInbox';
import socket from '../../helpers/socket';

function Inbox({
  handleArchiveIsOpen,
}) {
  const isDev = process.env.NODE_ENV === 'development';

  const { user, darkmode, selectedInbox } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [inboxs, setInboxs] = useState([]);

  const handleGetInboxs = () => {
    socket.emit('inbox/get', {
      userId: user.userId,
    });

    socket.on('inbox/get/callback', (args) => {
      if (args.sound) {
        const audio = new Audio(sound);
        audio.volume = 1;

        audio.play();
      }

      setInboxs(args.data);
    });
  }

  const handleFormatTime = (args) => moment(args).fromNow();
  const inboxOwner = (args) => args.find((item) => item.userId !== user.userId);

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

  const intervalRef = useRef(null);

  const handleHoldStart = (event, args) => {
    if (intervalRef.current) return;
    let counter = 0;

    intervalRef.current = setInterval(() => {
      counter += 1;

      if (counter >= 7) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;

        dispatch(action.insert({
          data: args,
        }));
      }
    }, 100);
  }

  const handleHoldEnd = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  const handleSelectedInbox = (data) => {
    const arr = selectedInbox.data;

    if (arr.includes(data)) {
      dispatch(action.remove({ data }));
      return;
    }

    dispatch(action.insert({ data }));
  }

  const handleOpenRoom = (args) => {
    dispatch({
      type: 'counter/roomIsOpen',
      payload: {
        active: true,
        data: {
          foreignId: inboxOwner(args.owners).userId,
          roomId: args.roomId,
        },
      },
    });
  }

  useEffect(() => {
    handleGetInboxs();
  }, [
    selectedInbox,
    inboxs.length,
  ]);

  return (
    <div className={`${style.inbox} ${darkmode ? style.dark : null}`}>
      <div
        className={`${style['archive-box']} ${inboxs.filter((item) => item.archived).length > 0 ? style.active : null}`}
        aria-hidden="true"
        onClick={handleArchiveIsOpen}
      >
        <span className={style.icon}>
          <box-icon name="archive" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
        </span>
        <h3 className={style.title}>Archived</h3>
        <p className={style.total}>{inboxs.filter((item) => item.archived).length}</p>
      </div>
      {
        inboxs
          .filter((item) => !item.archived)
          .map((item) => (
            <div
              className={`${style['inbox-cards']} ${selectedInbox.data.includes(item.roomId) ? style.focus : null}`}
              key={item._id}
              aria-hidden="true"
              onTouchStart={(event) => handleHoldStart(event, item.roomId)}
              onTouchEnd={handleHoldEnd}
              onMouseDown={(event) => handleHoldStart(event, item.roomId)}
              onMouseUp={handleHoldEnd}
              onClick={() => (
                selectedInbox.active ? handleSelectedInbox(item.roomId) : handleOpenRoom(item)
              )}
            >
              <img
                src={isDev ? `http://localhost:8000/api/images/${inboxOwner(item.owners).avatar}` : `/api/images/${inboxOwner(item.owners).avatar}`}
                className={style.avatar}
              />
              <div
                className={style.text}
                aria-hidden="true"
              >
                <span className={style.top}>
                  <h3 className={style['profile-name']}>{inboxOwner(item.owners).profileName}</h3>
                  <p className={style.time}>{handleFormatTime(item.lastMessage.createdAt)}</p>
                </span>
                <span className={style.ctx}>
                  {
                    item.lastMessage.from === user.userId
                    && (
                      <Condition
                        condition={item.lastMessage.condition}
                      />
                    )
                  }
                  <p
                    className={style.message}
                    style={{
                      margin: item.lastMessage.from === user.userId ? '0' : '0 40px 0 0',
                    }}
                  >
                    {item.lastMessage.text}
                  </p>
                  <p
                    className={style.total}
                    style={{
                      opacity: (() => {
                        if (item.lastMessage.from === user.userId ? 0 : 1) {
                          if (item.total > 0) return 1;
                          return 0;
                        }
                        return null;
                      })(),
                    }}
                  >
                    {
                      item.lastMessage.from !== user.userId && item.total > 0
                      && item.total
                    }
                  </p>
                </span>
              </div>
            </div>
          ))
      }
    </div>
  );
}

export default Inbox;
