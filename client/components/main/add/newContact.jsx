import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from '../../../styles/components/main/add/newContact.css';

import * as action from '../../../redux/actions';
import socket from '../../../helpers/socket';

function NewContact({
  handleContactTabIsOpen,
  contactTabIsOpen,
  setDataContact,
}) {
  const isDev = process.env.NODE_ENV === 'development';

  const mounted = useRef(true);

  const { user, darkmode } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [inputvalue, setInputvalue] = useState('');
  const [data, setData] = useState([]);
  const [blank, setBlank] = useState(false);

  function Blank() {
    return (
      <div className={style.blank}>
        <h3 className={style.title}>Users Not Found.</h3>
      </div>
    );
  }

  const handleForeignProfileIsOpen = (userId) => {
    handleContactTabIsOpen();

    setTimeout(() => {
      dispatch(action.foreignProfile({
        active: true,
        userId,
      }));
    }, 1000);
  }

  const handleChange = async (event) => {
    const token = localStorage.getItem('token');
    const { value } = event.target;

    setInputvalue(value);

    const url = isDev ? `http://localhost:8000/api/users?profile=${value}` : `/api/users?profile=${value}`;

    if (value.length === 0) {
      return setBlank(true);
    }

    const request = await (await fetch(url, {
      method: 'get',
      headers: {
        Authorization: `bearer ${token}`,
      },
    })).json();

    if (request.data.length === 0) {
      return setBlank(true);
    }

    setBlank(false);
    return setData(request.data);
  }

  const handleAddContact = (event) => {
    setInputvalue('');

    setTimeout(() => {
      handleContactTabIsOpen();
      setData([]);
    }, 200);

    setTimeout(() => {
      socket.emit('contact/add', event);
    }, 1000);
  }

  useEffect(() => {
    socket.on('contact/add/callback', (args) => {
      setDataContact(args.data);
    });

    return () => {
      mounted.current = false;
    }
  }, [blank]);

  return (
    <div
      className={`${style['contact-tab']} ${darkmode ? style.dark : null} ${contactTabIsOpen ? style.active : null}`}
    >
      <div className={style['contact-tab-main']}>
        <div className={style.navigation}>
          <button
            onClick={handleContactTabIsOpen}
            className={style.btn}
          >
            <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
          </button>
          <h2 className="title">Search.</h2>
        </div>
        <div className={style.form}>
          <box-icon name="search-alt" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="Enter Username or Email user"
            className={style['form-control']}
            onChange={handleChange}
            autoComplete="off"
            value={inputvalue}
          />
        </div>
        <div className={style.list}>
          {
            !blank
              ? data.map((item) => (
                <div
                  className={style.cards}
                  key={item._id}
                  aria-hidden="true"
                >
                  <img
                    className={style.avatar}
                    src={isDev ? `http://localhost:8000/api/images/${item.photo.avatar}` : `/api/images/${item.photo.avatar}`}
                  />
                  <div
                    className={style.text}
                    aria-hidden="true"
                    onClick={() => handleForeignProfileIsOpen(item.userId)}
                  >
                    <span className={style.info}>
                      <h3 className={style['profile-name']}>{item.profileName}</h3>
                      <p className={style.username}>{item.username}</p>
                    </span>
                  </div>
                  <button
                    className={style['add-btn']}
                    type="button"
                    onClick={() => handleAddContact({
                      socketId: socket.id,
                      ownerId: user.userId,
                      foreignId: item.userId,
                      username: item.username,
                      profileName: item.profileName,
                      avatar: item.photo.avatar,
                    })}
                  >
                    <box-icon name="user-plus" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
                  </button>
                </div>
              ))
              : <Blank />
          }
        </div>
      </div>
    </div>
  );
}

export default NewContact;
