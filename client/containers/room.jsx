import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import style from '../styles/containers/room.css';
import * as comp from '../components/room';

function Room() {
  const isDev = process.env.NODE_ENV === 'development';

  const { room, darkmode } = useSelector((state) => state);

  const [data, setData] = useState({
    foreignId: '',
    profileName: '',
    username: '',
    avatar: '',
  });

  const handleGetForeignUser = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = isDev ? `http://localhost:8000/api/users?id=${room.data.foreignId}` : `/api/users?id=${room.data.foreignId}`;

      const request = await (await fetch(url, {
        method: 'get',
        headers: {
          Authorization: `bearer ${token}`,
        },
      })).json();

      setData((prev) => ({
        ...prev,
        foreignId: request.data.userId,
        profileName: request.data.profileName,
        username: request.data.username,
        avatar: request.data.photo.avatar,
      }));
    }
    catch (error0) {
      console.log(error0.message);
    }
  }

  useEffect(() => {
    if (room.active) {
      handleGetForeignUser();
    }
  }, [room]);

  return (
    <div
      className={`${style.room} ${darkmode ? style.dark : null} ${room.active ? style.active : null}`}
    >
      <div className={style['room-wrap']}>
        {
          data && (
            < >
              <comp.header foreign={data} />
              <comp.chat />
              <comp.send foreign={data} />
            </>
          )
        }
        <comp.info />
      </div>
    </div>
  );
}

export default Room;
