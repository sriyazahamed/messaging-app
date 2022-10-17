import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import style from '../../styles/components/main/archive.css';

import socket from '../../helpers/socket';
import action from '../../redux/actions/selectedInbox';

function ArchiveBox({
  handleArchiveIsOpen,
  archiveIsOpen,
}) {
  const isDev = process.env.NODE_ENV === 'development';

  const { user, darkmode, selectedInbox } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [inboxs, setInboxs] = useState([]);

  const handleGetInboxs = () => {
    socket.emit('inbox/get', {
      socketId: socket.id,
      userId: user.userId,
    });

    socket.on('inbox/get/callback', (args) => {
      try {
        if (!args.success) {
          throw args;
        }

        setInboxs(args.data);
      }
      catch (error0) {
        console.log(error0.message);
      }
    });
  }

  const handleFormatTime = (args) => moment(args).fromNow();
  const inboxOwner = (args) => args.find((item) => item.userId !== user.userId);

  const Condition = ({ condition }) => {
    if (condition === 'read') {
      return (
        <span
          className={style['condition-icon']}
          style={{
            background: '#39A388',
          }}
        >
          <box-icon
            name="check-double"
            color={darkmode ? '#FF6768' : '#FF6768'}
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

  const handleUnArchived = () => {
    if (selectedInbox.data.length > 0) {
      socket.emit('inbox/archived', {
        active: false,
        data: selectedInbox.data,
        userId: user.userId,
      });

      dispatch(action.clear());
    }
  }

  useEffect(() => {
    handleGetInboxs();
  }, [
    selectedInbox,
  ]);

  return (
    <div
      className={`
        ${style.archive}
        ${archiveIsOpen ? style.active : null}
        ${darkmode ? style.dark : null}
      `}
    >
      <div className={style['archive-wrap']}>
        <div className={style.navigation}>
          <button
            onClick={handleArchiveIsOpen}
            className={style.btn}
          >
            <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
          </button>
          <h2 className={style.title}>Archived</h2>
          <div className={`${style.focused} ${selectedInbox.active ? style.active : null}`}>
            <div className={style['focused-wrap']}>
              <div className={style.left}>
                <button
                  onClick={() => dispatch(action.clear())}
                  className={style.btn}
                >
                  <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
                </button>
                <h3 className={style.count}>{selectedInbox.data.length}</h3>
              </div>
              <div className={style.right}>
                <button
                  type="button"
                  className={`${style.btn}`}
                  onClick={handleUnArchived}
                >
                  <box-icon name="archive-out" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
        {
          inboxs
            .filter((item) => item.archived)
            .map((item) => (
              <div
                className={`${style['archive-cards']} ${selectedInbox.data.includes(item.roomId) ? style.focus : null}`}
                key={item._id}
                aria-hidden="true"
                onTouchStart={(event) => handleHoldStart(event, item.roomId)}
                onTouchEnd={handleHoldEnd}
                onMouseDown={(event) => handleHoldStart(event, item.roomId)}
                onMouseUp={handleHoldEnd}
              >
                <img
                  src={isDev ? `http://localhost:8000/api/images/${inboxOwner(item.owners).avatar}` : `/api/images/${inboxOwner(item.owners).avatar}`}
                  className={style.avatar}
                />
                <div
                  className={style.text}
                  aria-hidden="true"
                  onClick={() => (
                    selectedInbox.active ? handleSelectedInbox(item.roomId) : handleOpenRoom(item)
                  )}
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
    </div>
  );
}

export default ArchiveBox;
