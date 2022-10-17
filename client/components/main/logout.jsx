import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import style from '../../styles/components/main/logout.css';

import socket from '../../helpers/socket';
import * as action from '../../redux/actions';

function Logout({
  handleLogoutTabIsOpen,
  logoutTabIsOpen,
}) {
  const { user, darkmode } = useSelector((state) => state);
  const dispatch = useDispatch();

  const handleLogout = () => {
    handleLogoutTabIsOpen();
    socket.emit('user/logout', { userId: user.userId });

    setTimeout(() => {
      localStorage.removeItem('token');
      dispatch(action.logout());

      socket.on('user/logout/callback', (args) => {
        console.log(args);
      });
    }, 800);
  }

  return (
    <div
      className={`
        ${style.logout}
        ${logoutTabIsOpen ? style.active : null}
        ${darkmode ? style.dark : null}
      `}
    >
      <div className={style['logout-wrap']}>
        <h2 className={style.title}>Logout</h2>
        <p>Are you sure you want to log out of this account?</p>
        <div className={style.action}>
          <button
            type="button"
            className={style.btn}
            onClick={handleLogoutTabIsOpen}
          >
            <box-icon name="x" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.paragraf}>No sure</p>
          </button>
          <button
            type="button"
            className={style.btn}
            onClick={handleLogout}
          >
            <box-icon name="check" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.paragraf}>Yes, I'm sure</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Logout;
