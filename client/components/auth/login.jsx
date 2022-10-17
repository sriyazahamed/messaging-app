import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import style from '../../styles/components/auth/login.css';
import * as action from '../../redux/actions';
import Forgot from './forgot';

function Login({
  registerPage,
  setRegisterPage,
}) {
  const isDev = process.env.NODE_ENV === 'development';
  const dispatch = useDispatch();
  const { darkmode } = useSelector((state) => state);

  const [forgotIsOpen, setForgotIsOpen] = useState(false);
  const [formbody, setFormbody] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [control, setControl] = useState({
    usernameOrEmail: false,
    password: false,
  });

  const [response, setResponse] = useState({
    success: true,
    message: '',
    active: false,
  });

  const handleChange = (event) => {
    setFormbody((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (!control.usernameOrEmail || !control.password) {
        const newError = {
          message: 'Form data is not approved, please fill in the form correctly',
        };
        throw newError;
      }

      const url = isDev ? 'http://localhost:8000/api/users/login' : '/api/users/login';
      const request = await (await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: formbody.usernameOrEmail,
          password: formbody.password,
        }),
      })).json();

      if (!request.success) {
        const newError = {
          message: request.message,
        };
        throw newError;
      }

      setResponse((prev) => ({
        ...prev,
        success: true,
        message: 'Authenticate',
        active: true,
      }));

      localStorage.setItem('token', request.data);

      setFormbody((prev) => ({
        ...prev, usernameOrEmail: '', password: '',
      }));

      setTimeout(() => {
        dispatch(action.loggedIn({
          active: true,
        }));
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
  };

  useEffect(() => {
    if (formbody.usernameOrEmail.length >= 3) {
      setControl((prev) => ({
        ...prev,
        usernameOrEmail: true,
      }));
    } else {
      setControl((prev) => ({
        ...prev,
        usernameOrEmail: false,
      }));
    }

    const passValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\W).{8,16}$/g;

    if (passValid.test(formbody.password)) {
      setControl((prev) => ({
        ...prev,
        password: true,
      }));
    } else {
      setControl((prev) => ({
        ...prev,
        password: false,
      }));
    }
  }, [
    formbody,
  ]);

  return (
    <div
      className={`
        ${style.login}
        ${registerPage ? null : style.active}
        ${darkmode ? style.dark : null}
      `}
    >
      <Forgot
        forgotIsOpen={forgotIsOpen}
        setForgotIsOpen={setForgotIsOpen}
      />
      <div className={style['login-wrap']}>
        <div className={style.header}>
          <h2>Messaging.</h2>
          <p>Welcome to the messaging app, please login to your account to start a conversation.</p>
        </div>
        <form
          method="post"
          className={style.control}
          onSubmit={handleSubmit}
        >
          <label htmlFor="usernameOrEmail" className={style.cards}>
            <box-icon
              name="user"
              color={darkmode ? '#ffffffdd' : '#000000dd'}
            >
            </box-icon>
            <span className={style['input-field']}>
              <p className={style.label}>Username or Email Address</p>
              <input
                type="text"
                name="usernameOrEmail"
                id="usernameOrEmail"
                value={formbody.usernameOrEmail}
                onChange={handleChange}
                required
              />
            </span>
            <box-icon
              name={control.usernameOrEmail ? 'check-circle' : 'x-circle'}
              color={`${control.usernameOrEmail ? '#00A19D' : '#B91646'}`}
            >
            </box-icon>
          </label>
          <label htmlFor="password" className={style.cards}>
            <box-icon
              name="lock-open"
              color={darkmode ? '#ffffffdd' : '#000000dd'}
            >
            </box-icon>
            <span className={style['input-field']}>
              <p className={style.label}>Password</p>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Must contain A-Za-z, 0-9 & symbols"
                value={formbody.password}
                onChange={handleChange}
                required
              />
            </span>
            <box-icon
              name={control.password ? 'check-circle' : 'x-circle'}
              color={`${control.password ? '#00A19D' : '#B91646'}`}
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
          <div className={style.action}>
            <div className={style.remember}>
              <button type="button" className={style['remember-check']}></button>
              <p>Remember Me</p>
            </div>
            <button
              type="button"
              className={style.forgot}
              onClick={() => setForgotIsOpen(true)}
            >
              Forgot Password
            </button>
          </div>
          <span className={style.submit}>
            <button type="submit" className={style.btn}>
              <p>Login</p>
              <box-icon
                type="solid"
                name="right-top-arrow-circle"
                color={darkmode ? '#ffffffdd' : '#000000dd'}
              >
              </box-icon>
            </button>
          </span>
        </form>
        <div className={style.footer}>
          <p>Don't have an account yet?</p>
          <button
            className={style.btn}
            onClick={setRegisterPage}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
