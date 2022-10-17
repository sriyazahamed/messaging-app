import React from 'react';
import { useSelector } from 'react-redux';
import style from '../../styles/components/main/setting.css';

function Setting({
  handleSettingIsOpen,
  settingIsOpen,
}) {
  const { darkmode } = useSelector((state) => state);
  return (
    <div
      className={`
        ${style.setting}
        ${settingIsOpen ? style.active : null}
        ${darkmode ? style.dark : null}
      `}
    >
      <div className={style.navigation}>
        <button
          onClick={handleSettingIsOpen}
          className={style.btn}
        >
          <box-icon name="arrow-back" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
        </button>
        <h2 className={style.title}>Setting</h2>
      </div>
      <div className={style['setting-wrap']}>
        <div
          className={style.section}
        >
          <div className={style.cards}>
            <box-icon name="adjust" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.title}>Dark Mode</p>
            <span className={style.check}>
              <span className={style.dot}></span>
            </span>
          </div>
        </div>
        <div
          className={style.section}
        >
          <h3 className={style.label}>Account</h3>
          <div className={style.cards}>
            <box-icon name="key" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.title}>Change password</p>
          </div>
          <div className={style.cards}>
            <box-icon name="power-off" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.title}>Delete account</p>
          </div>
        </div>
        <div
          className={style.section}
        >
          <h3 className={style.label}>Chat</h3>
          <div className={style.cards}>
            <box-icon name="paper-plane" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.title}>Enter to send message</p>
            <span className={style.check}>
              <span className={style.dot}></span>
            </span>
          </div>
        </div>
        <div
          className={style.section}
        >
          <h3 className={style.label}>Notification</h3>
          <div className={style.cards}>
            <box-icon name="bell" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.title}>Ringtone</p>
          </div>
        </div>
        <div
          className={style.section}
        >
          <h3 className={style.label}>Help</h3>
          <div className={style.cards}>
            <box-icon name="shield" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.title}>Privacy policy</p>
          </div>
          <div className={style.cards}>
            <box-icon name="info-circle" color={darkmode ? '#ffffffdd' : '#000000dd'}></box-icon>
            <p className={style.title}>Information</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
