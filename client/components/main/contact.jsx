import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import style from '../../styles/components/main/contact.css';

import * as comp from './add';

import * as action from '../../redux/actions';
import socket from '../../helpers/socket';

function Contact({
  handleContactIsOpen,
  contactIsOpen,
}) {
  const isDev = process.env.NODE_ENV === 'development';

  const dispatch = useDispatch();

  const { user, darkmode } = useSelector((state) => state);
  const [state, setState] = useState({
    groupTabIsOpen: false,
    contactTabIsOpen: false,
  });

  const [data, setData] = useState([]);

  const handleContactTabIsOpen = () => {
    setState((prev) => ({
      ...prev,
      contactTabIsOpen: !prev.contactTabIsOpen,
    }));
  }

  const handleGetContact = () => {
    socket.emit('contact/get', {
      socketId: socket.id,
      ownerId: user.userId,
    });

    socket.on('contact/get/callback', (args) => {
      setData(args.data);
    });
  }

  const handleOpenChatRoom = (args) => {
    socket.emit('inbox/open', {
      userId: user.userId,
      foreignId: args.foreignId,
    });

    socket.on('inbox/open/callback', (args1) => {
      try {
        if (!args1.success) throw args1;

        dispatch(action.roomIsOpen({
          active: true,
          foreignId: args.foreignId,
          roomId: args1.roomId,
        }));
      }
      catch (error0) {
        dispatch(action.roomIsOpen({
          active: true,
          foreignId: args.foreignId,
          roomId: uuidv4(),
        }));
      }
    });
  }

  useEffect(() => {
    handleGetContact();
  }, []);

  return (
    <div
      className={`${style.contact} ${darkmode ? style.dark : null} ${contactIsOpen ? style.active : null}`}
    >
      <div className={style['contact-wrap']}>
        <comp.newContact
          handleContactTabIsOpen={handleContactTabIsOpen}
          contactTabIsOpen={state.contactTabIsOpen}
          setDataContact={setData}
        />
        <div className={style.navigation}>
          <button
            onClick={handleContactIsOpen}
            className={style.btn}
          >
            <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
          </button>
          <h2 className={style.title}>Contact</h2>
        </div>
        <div className={style.new}>
          <div className={style.cards}>
            <span className={style.icon}>
              <box-icon name="group" color="#000000dd"></box-icon>
            </span>
            <p>Create a new group</p>
          </div>
          <div
            className={style.cards}
            onClick={handleContactTabIsOpen}
            aria-hidden="true"
          >
            <span className={style.icon}>
              <box-icon name="user-plus" color="#000000dd"></box-icon>
            </span>
            <p>Add new contact</p>
          </div>
        </div>
        <div className={style.list}>
          {
            data.map((item) => (
              <div
                className={style.cards}
                key={item._id}
                onClick={() => handleOpenChatRoom({
                  foreignId: item.foreignId,
                })}
                aria-hidden="true"
              >
                <img
                  className={style.avatar}
                  src={isDev ? `http://localhost:8000/api/images/${item.avatar}` : `/api/images/${item.avatar}`}
                />
                <div
                  className={style.text}
                  aria-hidden="true"
                >
                  <span className={style.info}>
                    <h3 className={style['profile-name']}>{item.profileName}</h3>
                    <p className={style.username}>@{item.username}</p>
                  </span>
                </div>
                <span>
                  <box-icon name="dots-vertical-rounded" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default Contact;
