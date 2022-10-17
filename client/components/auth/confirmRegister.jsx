import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import style from '../../styles/components/auth/confirmRegister.css';

function ConfirmRegister({
  setRegisterPage,
  setConfirmForm,
}) {
  const isDev = process.env.NODE_ENV === 'development';
  const { darkmode } = useSelector((state) => state);

  const [control, setControl] = useState(false);
  const [key, setKey] = useState('');
  const [response, setResponse] = useState({
    success: true,
    message: '',
    active: false,
  });

  const handleChange = (event) => setKey(event.target.value);

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      const url = isDev ? 'http://localhost:8000/api/users/register/confirm' : '/api/users/register/confirm';
      const storage = JSON.parse(localStorage.getItem('pending'));

      if (key !== String(storage.key)) {
        const newError = {
          message: 'OTP code does not match, please check your code again',
        }
        throw newError;
      }

      const request = await (await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storage),
      })).json();

      if (!request.success) {
        throw request;
      }

      setResponse((prev) => ({
        ...prev,
        success: true,
        message: 'You have completed all stages of registration, now it\'s time to log in to your account',
        active: true,
      }));

      setTimeout(() => {
        setRegisterPage();
      }, 1500);

      setTimeout(() => {
        setConfirmForm();
        localStorage.removeItem('pending');
      }, 2000);
    }
    catch (error0) {
      setResponse((prev) => ({
        ...prev,
        success: false,
        message: error0.message,
        active: true,
      }));
    }
  }

  useEffect(() => {
    const validation = /^[0-9]*$/g.test(key);
    const storage = JSON.parse(localStorage.getItem('pending'));

    if (storage) {
      setTimeout(() => {
        setKey(String(storage.key));
      }, 5000);
    }

    if (
      validation
      && key === String(storage.key)
      && key.length === 4
    ) {
      setControl(true);
    } else {
      setControl(false);
    }
  }, [key]);

  return (
    <form
      method="post"
      className={`${style.form} ${darkmode ? style.dark : null}`}
      onSubmit={handleSubmit}
    >
      <label htmlFor="key" className={style.cards}>
        <box-icon
          name="key"
          color={darkmode ? '#ffffffdd' : '#000000dd'}
        >
        </box-icon>
        <span className={style['input-field']}>
          <p className={style.label}>4 digit code</p>
          <input
            type="key"
            name="key"
            id="key"
            placeholder="Enter your registration code"
            value={key}
            onChange={handleChange}
            required
          />
        </span>
        <box-icon
          name={control ? 'check-circle' : 'x-circle'}
          color={`${control ? '#00A19D' : '#B91646'}`}
        >
        </box-icon>
      </label>
      <div className={`${style.response} ${response.active ? style.active : null}`}>
        <box-icon
          name={`${response.success ? 'check-circle' : 'x-circle'}`}
          color={`${response.success ? '#00A19D' : '#B91646'}`}
        >
        </box-icon>
        <p>{response.message}</p>
      </div>
      <span className={style.submit}>
        <button type="submit" className={style.btn}>Create Account</button>
      </span>
    </form>
  );
}

export default ConfirmRegister;
