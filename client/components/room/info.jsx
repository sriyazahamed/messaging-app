import React from 'react';
import { useSelector } from 'react-redux';
import style from '../../styles/components/room/info.css';

function Info() {
  const { room, darkmode } = useSelector((state) => state);

  return (
    <div
      className={`${style.info} ${room.active ? style.active : null} ${darkmode ? style.dark : null}`}
    >
      <div className={style['info-wrap']}>
        <h1 className={style.title}>Messaging.</h1>
        <p className={style.paragraf}>
          Make sure your device is connected to the internet.
        </p>
        <p className={style.paragraf}>
          This project is always open for those of you who want to contribute to this project,
          if you like this project don't forget to give a star, thank you.
        </p>
        <a
          href="https://github.com/febriadj/messaging-app"
          target="_blank"
          rel="noopener noreferrer"
          className={style.link}
        >
          <box-icon
            type="logo"
            size="md"
            color={darkmode ? '#ffffffdd' : '#000000dd'}
            name="github"
          >
          </box-icon>
        </a>
      </div>
    </div>
  );
}

export default Info;
