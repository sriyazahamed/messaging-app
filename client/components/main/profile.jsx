import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import style from '../../styles/components/main/profile.css';

import * as action from '../../redux/actions';
import socket from '../../helpers/socket';

function Profile({
  handleProfileIsOpen,
  profileIsOpen,
}) {
  const isDev = process.env.NODE_ENV === 'development';

  const { user, darkmode } = useSelector((state) => state);
  const dispatch = useDispatch();

  const [readOnly, setReadOnly] = useState({
    bio: true,
    email: true,
    phone: true,
  });

  const [formbody, setFormbody] = useState({
    profileName: user.profileName,
    bio: user.bio,
    phone: user.phone,
    avatar: user.photo.avatar,
    banner: user.photo.banner,
  });

  const formatDate = (args) => {
    const date = new Date(args).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return date;
  }

  const handleChange = (event) => {
    setFormbody((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  }

  const handleSubmit = () => {
    const data = { _id: user.userId, ...formbody };

    socket.emit('user/update', data);
  }

  useEffect(() => {
    socket.on('user/update/callback', (args) => {
      dispatch(action.getUser({
        data: args.data,
      }));

      setFormbody((prev) => ({
        ...prev,
        profileName: args.data.profileName,
        bio: args.data.bio,
        phone: args.data.phone,
      }));
    });
  });

  return (
    <div
      className={`${style.profile} ${darkmode ? style.dark : null} ${profileIsOpen ? style.active : null}`}
    >
      <div className={style['profile-wrap']}>
        <div
          className={style.header}
          style={{
            background: `url(${isDev ? `http://localhost:8000/api/images/${formbody.banner}` : `/api/images/${formbody.banner}`}) center center no-repeat`,
            backgroundSize: 'cover',
          }}
        >
          <div className={style.navigation}>
            <button
              onClick={handleProfileIsOpen}
            >
              <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            </button>
          </div>
          <img
            className={style.avatar}
            src={isDev ? `http://localhost:8000/api/images/${formbody.avatar}` : `/api/images/${formbody.avatar}`}
          />
        </div>
        <form method="post" className={style.info}>
          <div className={style.cards}>
            <h1 className={style['profile-name']}>{formbody.profileName}</h1>
            <p>@{user.username}</p>
          </div>
          <div className={style.cards}>
            <box-icon name="info-circle" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <div
              className={`${style.text} ${readOnly.bio ? null : style.active}`}
            >
              <input
                type="text"
                name="bio"
                className={style['form-control']}
                value={formbody.bio}
                readOnly={!!readOnly.bio}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={
                  readOnly.bio
                    ? () => setReadOnly((prev) => ({
                      ...prev,
                      bio: !prev.bio,
                    }))
                    : () => {
                      setReadOnly((prev) => ({
                        ...prev,
                        bio: !prev.bio,
                      }));
                      handleSubmit();
                    }
                }
              >
                <box-icon
                  name={readOnly.bio ? 'pencil' : 'right-top-arrow-circle'}
                  color={darkmode ? '#ffffffdd' : '#000000dd'}
                >
                </box-icon>
              </button>
            </div>
          </div>
          <div className={style.cards}>
            <box-icon name="phone" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <div
              className={`${style.text} ${readOnly.phone ? null : style.active}`}
            >
              <span className={style['num-code']}>
                <p>+62</p>
                <input
                  className={style['form-control']}
                  type="number"
                  name="phone"
                  value={formbody.phone}
                  readOnly={!!readOnly.phone}
                  onChange={handleChange}
                />
              </span>
              <button
                type="button"
                onClick={
                  readOnly.phone
                    ? () => setReadOnly((prev) => ({
                      ...prev,
                      phone: !prev.phone,
                    }))
                    : () => {
                      setReadOnly((prev) => ({
                        ...prev,
                        phone: !prev.phone,
                      }));
                      handleSubmit();
                    }
                }
              >
                <box-icon
                  name={readOnly.phone ? 'pencil' : 'right-top-arrow-circle'}
                  color={darkmode ? '#ffffffdd' : '#000000dd'}
                >
                </box-icon>
              </button>
            </div>
          </div>
          <div className={style.cards}>
            <box-icon name="envelope" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <div className={style.text}>
              <p>{user.email}</p>
              <box-icon name="envelope" color="#00000000"></box-icon>
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

export default Profile;
