import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from './styles/utils/app.css';
import 'boxicons';

import socket from './helpers/socket';

import * as action from './redux/actions';
import * as cont from './containers';
import Loading from './helpers/components/loading';

function App() {
  const isDev = process.env.NODE_ENV === 'development';

  const props = useSelector((state) => state);
  const dispatch = useDispatch();

  // const [block, setBlock] = useState(false);
  const [loadData, setLoadData] = useState(true);

  const handleGetUser = async () => {
    const token = localStorage.getItem('token');
    const url = isDev ? 'http://localhost:8000/api/users?init=true' : '/api/users?init=true';

    const request = await (await fetch(url, {
      method: 'get',
      headers: {
        Authorization: `bearer ${token}`,
      },
    })).json();

    document.title = `Messaging - @${request.data.username}`;

    socket.emit('user/connect', {
      socketId: socket.id,
      userId: request.data.userId,
    });

    // socket.on('user/connect/callback', (args) => {
    //   if (!args.success) {
    //     setBlock(true);
    //   } else {
    //     setBlock(false);
    //   }
    // });

    dispatch(action.getUser({
      data: request.data,
    }));
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(action.loggedIn({
        active: true,
      }));
    }

    if (props.loggedIn) handleGetUser();

    setTimeout(() => {
      setLoadData(false);
    }, 3000);
  }, [
    props.loggedIn,
  ]);

  return (
    <div
      className={`${style.app} ${props.darkmode ? style.dark : null} ${props.loggedIn && props.user ? null : style.active}`}
    >
      {
        loadData && (
          <div className={`${style.load} ${props.darkmode ? style.dark : null}`}>
            <Loading />
          </div>
        )
      }
      {/* {
        block && (
          <div className={`${style.multiple} ${props.darkmode ? style.dark : null}`}>
            <div className={style['multiple-wrap']}>
              <h2 className={style.title}>
                Your access is <span className={style.skin}>denied</span>.
              </h2>
              <p className={style.paragraf}>
                your account is detected as active on another device/tab,
                for the convenience of users, we don't allow you
                to use an account on a different device/tab
              </p>
            </div>
          </div>
        )
      } */}
      {
        props.loggedIn && props.user ? (
          < >
            <cont.main />
            <cont.room />
          </>
        ) : <cont.auth />
      }
    </div>
  );
}

export default App;
