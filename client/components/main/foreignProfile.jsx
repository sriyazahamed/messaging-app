import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import style from '../../styles/components/main/foreignProfile.css';

import * as action from '../../redux/actions';

function ForeignProfile() {
  const isDev = process.env.NODE_ENV === 'development';

  const { foreignProfile, darkmode } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    username: '',
    profileName: '',
    email: '',
    bio: '',
    phone: '',
    photo: {
      avatar: '',
      banner: '',
    },
    createdAt: '',
  });

  const closeForeignProfile = () => {
    dispatch(action.foreignProfile({
      active: false,
      userId: '',
    }));
  }

  const handleGetUser = async () => {
    try {
      const token = localStorage.getItem('token');

      const url = isDev ? `http://localhost:8000/api/users?id=${foreignProfile.userId}` : `/api/users?id=${foreignProfile.userId}`;
      const request = await (await fetch(url, {
        method: 'get',
        headers: {
          Authorization: `bearer ${token}`,
        },
      })).json();

      setUser((prev) => ({
        ...prev,
        ...request.data,
      }));
    }
    catch (error0) {
      console.log(error0.message);
    }
  }

  const formatDate = (args) => {
    const date = new Date(args).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return date;
  }

  useEffect(() => {
    if (foreignProfile.active) {
      handleGetUser();
    }
  });

  return (
    <div
      className={`${style['foreign-profile']} ${foreignProfile.active ? style.active : null} ${darkmode ? style.dark : null}`}
    >
      <div className={style['foreign-profile-wrap']}>
        <div
          className={style.header}
        >
          <img
            className={style.banner}
            src={isDev ? `http://localhost:8000/api/images/${user.photo.banner}` : `/api/images/${user.photo.banner}`}
          />
          <div className={style.navigation}>
            <button
              onClick={closeForeignProfile}
            >
              <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            </button>
          </div>
          <img
            className={style.avatar}
            src={isDev ? `http://localhost:8000/api/images/${user.photo.avatar}` : `/api/images/${user.photo.avatar}`}
          />
        </div>
        <form method="post" className={style.info}>
          <div className={style.cards}>
            <h1 className={style['profile-name']}>{user.profileName}</h1>
            <p className={style.username}>@{user.username}</p>
          </div>
          <div className={style.cards}>
            <box-icon name="info-circle" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <div className={style.text}>
              <p>{user.bio}</p>
            </div>
          </div>
          <div className={style.cards}>
            <box-icon name="phone" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <div className={style.text}>
              <span className={style['num-code']}>
                <p>+62</p>
                <p>{user.phone}</p>
              </span>
            </div>
          </div>
          <div className={style.cards}>
            <box-icon name="envelope" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <div className={style.text}>
              <p>{user.email}</p>
            </div>
          </div>
        </form>
        <div className={style.footer}>
          <p>Joined Since</p>
          <h1
            className={style.date}
          >
            {formatDate(user.createdAt)}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default ForeignProfile;
