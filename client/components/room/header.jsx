import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import style from '../../styles/components/room/header.css';

import * as action from '../../redux/actions';

function Header({ foreign }) {
  const isDev = process.env.NODE_ENV === 'development';

  const { room, darkmode } = useSelector((state) => state);
  const dispatch = useDispatch();

  return (
    <div className={`${style.header} ${darkmode ? style.dark : null}`}>
      <button
        type="button"
        className={`${style['close-btn']}`}
        onClick={() => dispatch(action.roomIsOpen({
          active: false,
          foreignId: room.data.foreignId,
          roomId: room.data.roomId,
        }))}
      >
        <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
      </button>
      <div className={style.profile}>
        <img
          className={style.avatar}
          src={isDev ? `http://localhost:8000/api/images/${foreign.avatar}` : `/api/images/${foreign.avatar}`}
        />
        <div className={style.info}>
          <h3 className={style['profile-name']}>{foreign.profileName}</h3>
          <p className={style.online}>online</p>
        </div>
      </div>
      <div className={style.action}>
        <button
          type="button"
          className={style.btn}
        >
          <box-icon name="phone" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
        </button>
        <button
          type="button"
          className={style.btn}
        >
          <box-icon name="dots-vertical-rounded" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
        </button>
      </div>
    </div>
  );
}

export default Header;
