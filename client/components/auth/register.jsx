import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import style from '../../styles/components/auth/register.css';

import ConfirmRegister from './confirmRegister';

function Register({
  registerPage,
  setRegisterPage,
}) {
  const isDev = process.env.NODE_ENV === 'development';
  const { darkmode } = useSelector((state) => state);

  const [formbody, setFormbody] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [control, setControl] = useState({
    username: false,
    email: false,
    password: false,
  });

  const [confirmForm, setConfirmForm] = useState(false);

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
  }

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (!control.username || !control.email || !control.password) {
        const newError = {
          message: 'Form data is not approved, please fill in the form correctly',
        }
        throw newError;
      }

      const url = isDev ? 'http://localhost:8000/api/users/register' : '/api/users/register';
      const request = await (await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formbody.username,
          email: formbody.email,
          password: formbody.password,
        }),
      })).json();

      if (!request.success) {
        const newError = {
          message: request.message,
        }
        throw newError;
      }

      setResponse((prev) => ({
        ...prev,
        success: true,
        message: 'Account created successfully',
        active: true,
      }));

      localStorage.setItem('pending', JSON.stringify(request.data));

      setFormbody((prev) => ({
        ...prev, username: '', email: '', password: '',
      }));

      setTimeout(() => {
        setConfirmForm(true);
      }, 1500);
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
    const storage = localStorage.getItem('pending');

    if (storage) {
      setConfirmForm(true);
    }

    const usernameValid = /^[a-z]*$/g.test(formbody.username);
    if (
      usernameValid
      && formbody.username.length >= 3
      && formbody.username.length < 17
    ) {
      setControl((prev) => ({
        ...prev,
        username: true,
      }));
    } else {
      setControl((prev) => ({
        ...prev,
        username: false,
      }));
    }

    const emailValid = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;

    if (emailValid.test(formbody.email)) {
      setControl((prev) => ({
        ...prev,
        email: true,
      }));
    } else {
      setControl((prev) => ({
        ...prev,
        email: false,
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
        ${style.register}
        ${registerPage ? style.active : null}
        ${darkmode ? style.dark : null}
      `}
    >
      <div className={style['register-wrap']}>
        <div className={style.header}>
          <h2>Register.</h2>
          {
            confirmForm ? (
              <p>
                to continue registering your account,
                please enter your registration code that we have sent via Gmail.
              </p>
            ) : (
              <p>
                Register your account & start a conversation with your friends any + where/time.
              </p>
            )
          }
        </div>
        {
          confirmForm ? (
            <ConfirmRegister
              setRegisterPage={setRegisterPage}
              setConfirmForm={() => setConfirmForm(false)}
            />
          ) : (
            <form
              method="post"
              className={style.form}
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <label htmlFor="username" className={style.cards}>
                <box-icon
                  name="user"
                  color={darkmode ? '#ffffffdd' : '#000000dd'}
                >
                </box-icon>
                <span className={style['input-field']}>
                  <p className={style.label}>Username</p>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Length 3-16, must be lowercase"
                    value={formbody.username}
                    onChange={handleChange}
                    required
                  />
                </span>
                <box-icon
                  name={control.username ? 'check-circle' : 'x-circle'}
                  color={`${control.username ? '#00A19D' : '#B91646'}`}
                >
                </box-icon>
              </label>
              <label htmlFor="email" className={style.cards}>
                <box-icon
                  name="envelope"
                  color={darkmode ? '#ffffffdd' : '#000000dd'}
                >
                </box-icon>
                <span className={style['input-field']}>
                  <p className={style.label}>Email Address</p>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formbody.email}
                    onChange={handleChange}
                    required
                  />
                </span>
                <box-icon
                  name={control.email ? 'check-circle' : 'x-circle'}
                  color={`${control.email ? '#00A19D' : '#B91646'}`}
                >
                </box-icon>
              </label>
              <label htmlFor="password-regis" className={style.cards}>
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
                    id="password-regis"
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
              <span className={style.submit}>
                <button type="submit" className={style.btn}>
                  <p>Create Account</p>
                  <box-icon
                    type="solid"
                    name="right-top-arrow-circle"
                    color={darkmode ? '#ffffffdd' : '#000000dd'}
                  >
                  </box-icon>
                </button>
              </span>
            </form>
          )
        }
        <div className={style.footer}>
          <p>Already have an account?</p>
          <button
            className={style.btn}
            onClick={setRegisterPage}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
