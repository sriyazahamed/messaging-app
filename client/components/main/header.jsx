import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import style from '../../styles/components/main/header.css';

import action from '../../redux/actions/selectedInbox';
import socket from '../../helpers/socket';

function Header({
  handleMiniTabIsOpen,
  miniTabIsOpen,
  handleContactIsOpen,
}) {
  const { darkmode, user, selectedInbox } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleArchived = () => {
    if (selectedInbox.data.length > 0) {
      socket.emit('inbox/archived', {
        active: true,
        data: selectedInbox.data,
        userId: user.userId,
      });

      dispatch(action.clear());
    }
  }

  const handleDeleteInbox = () => {
    socket.emit('inbox/delete', {
      data: selectedInbox.data,
      userId: user.userId,
    });

    dispatch(action.clear());
  }

  return (
    <div
      className={`
        ${style.header}
        ${darkmode ? style.dark : null}
      `}
    >
      <div className={style.top}>
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
                onClick={handleArchived}
              >
                <box-icon name="archive" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
              </button>
              <button
                type="button"
                className={`${style.btn} ${style['message-btn']}`}
                onClick={handleDeleteInbox}
              >
                <box-icon name="trash" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
              </button>
            </div>
          </div>
        </div>
        <h2 className={style.title}>Messaging</h2>
        <div className={style.navigation}>
          <button
            type="button"
            className={`${style.btn}`}
          >
            <box-icon type="reguler" name="rotate-left" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
          </button>
          <button
            type="button"
            className={`${style.btn} ${style['message-btn']}`}
            onClick={handleContactIsOpen}
          >
            <box-icon type="reguler" name="message-square-dots" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
          </button>
          <button
            type="button"
            className={`${style.btn} ${miniTabIsOpen ? style.active : null}`}
            onClick={handleMiniTabIsOpen}
          >
            <box-icon name="dots-vertical-rounded" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
          </button>
        </div>
      </div>
      <div className={style['search-bar']}>
        <span className={style.icon}>
          <box-icon name="search-alt" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
        </span>
        <input
          type="search"
          name="search"
          placeholder="Search chat, group or start a new chat"
          className={style['form-control']}
        />
      </div>
    </div>
  );
}

export default Header;
