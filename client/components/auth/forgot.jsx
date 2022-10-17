import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import style from '../../styles/components/auth/forgot.css';

function Forgot({
  forgotIsOpen,
  setForgotIsOpen,
}) {
  const isDev = process.env.NODE_ENV === 'development';
  const { darkmode } = useSelector((state) => state);

  const [step2, setStep2] = useState(false);
  const [formbody, setFormbody] = useState({
    usernameOrEmail: '',
    referral: '',
    newPass: '',
    confirmNewPass: '',
  });

  const [control, setControl] = useState({
    usernameOrEmail: false,
    referral: false,
    newPass: false,
    confirmNewPass: false,
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
      const url = isDev ? 'http://localhost:8000/api/users/change-pass' : '/api/users/change-pass';

      const request = await (await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: formbody.usernameOrEmail,
          newPass: formbody.newPass,
        }),
      })).json();

      if (!request.success) throw request;
      localStorage.setItem('pending-forgot', JSON.stringify({
        userId: request.data._id,
        referral: request.data.referral,
        newPass: formbody.newPass,
      }));

      setFormbody((prev) => ({
        ...prev,
        usernameOrEmail: '',
        newPass: '',
        confirmNewPass: '',
      }));

      console.log(request.data);
      setTimeout(() => setStep2(true), 800);
    }
    catch (error0) {
      console.error(error0.message);
    }
  };

  const handleSubmitReferral = async (event) => {
    try {
      event.preventDefault();

      const pending = JSON.parse(localStorage.getItem('pending-forgot'));
      const url = isDev ? 'http://localhost:8000/api/users/change-pass/confirm' : '/api/users/change-pass/confirm';

      if (String(pending.referral) !== formbody.referral) {
        const newError = {
          message: 'Invalid referral code',
        };
        throw newError;
      }

      const request = await (await fetch(url, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: pending.userId,
          password: pending.newPass,
        }),
      })).json();

      if (!request.success) throw request;

      setFormbody((prev) => ({
        ...prev,
        referral: '',
      }));

      setResponse((prev) => ({
        ...prev,
        success: true,
        message: request.message,
        active: true,
      }));

      setTimeout(() => setForgotIsOpen(false), 1000);
    }
    catch (error0) {
      setFormbody((prev) => ({
        ...prev,
        referral: '',
      }));

      setResponse((prev) => ({
        ...prev,
        success: false,
        message: error0.message,
        active: true,
      }));
    }
  };

  useEffect(() => {
    const pending = localStorage.getItem('pending-forgot');
    setStep2(!!pending);
  }, [step2]);

  useEffect(() => {
    const passValid = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*\W).{8,16}$/g;

    setControl((prev) => {
      const cnp1 = formbody.confirmNewPass.length > 0;
      const cnp2 = formbody.newPass === formbody.confirmNewPass;

      return {
        ...prev,
        usernameOrEmail: formbody.usernameOrEmail.length >= 3,
        referral: formbody.referral.length === 6,
        newPass: passValid.test(formbody.newPass),
        confirmNewPass: cnp1 && cnp2,
      };
    });
  }, [formbody]);

  return (
    <div className={`${style.forgot} ${forgotIsOpen && style.active}`}>
      <div className={style['forgot-wrap']}>
        <div className={style.header}>
          <div className={style.top}>
            <h2>Forgot Password</h2>
            <button
              type="submit"
              className={style.btn}
              onClick={() => {
                setForgotIsOpen(false);
              }}
            >
              <box-icon
                name="x"
                color={darkmode ? '#ffffffdd' : '#000000dd'}
              >
              </box-icon>
            </button>
          </div>
          <p>Your referral code has been sent to your email. Please check your email again.</p>
        </div>
        { !step2 && (
          <form method="post" className={style.form} onSubmit={handleSubmit}>
            <label htmlFor="forgotUsernameOrEmail" className={style.cards}>
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
                  id="forgotUsernameOrEmail"
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
            <label htmlFor="newPass" className={style.cards}>
              <box-icon
                name="lock-open"
                color={darkmode ? '#ffffffdd' : '#000000dd'}
              >
              </box-icon>
              <span className={style['input-field']}>
                <p className={style.label}>New Password</p>
                <input
                  type="password"
                  name="newPass"
                  id="newPass"
                  placeholder="Must contain A-Za-z, 0-9 & symbols"
                  value={formbody.newPass}
                  onChange={handleChange}
                  required
                />
              </span>
              <box-icon
                name={control.newPass ? 'check-circle' : 'x-circle'}
                color={`${control.newPass ? '#00A19D' : '#B91646'}`}
              >
              </box-icon>
            </label>
            <label htmlFor="confirmNewPass" className={style.cards}>
              <box-icon
                name="lock-open"
                color={darkmode ? '#ffffffdd' : '#000000dd'}
              >
              </box-icon>
              <span className={style['input-field']}>
                <p className={style.label}>Confirm New Password</p>
                <input
                  type="password"
                  name="confirmNewPass"
                  id="confirmNewPass"
                  placeholder="Re-enter password"
                  value={formbody.confirmNewPass}
                  onChange={handleChange}
                  required
                />
              </span>
              <box-icon
                name={control.confirmNewPass ? 'check-circle' : 'x-circle'}
                color={`${control.confirmNewPass ? '#00A19D' : '#B91646'}`}
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
                <p>Change Password</p>
                <box-icon
                  type="solid"
                  name="right-top-arrow-circle"
                  color={darkmode ? '#ffffffdd' : '#000000dd'}
                >
                </box-icon>
              </button>
            </span>
          </form>
        ) }
        { step2 && (
          <form method="post" className={style.form} onSubmit={handleSubmitReferral}>
            <label htmlFor="referral" className={style.cards}>
              <box-icon
                name="key"
                color={darkmode ? '#ffffffdd' : '#000000dd'}
              >
              </box-icon>
              <span className={style['input-field']}>
                <p className={style.label}>Referral Code</p>
                <input
                  type="text"
                  name="referral"
                  id="referral"
                  placeholder="6 digit referral code"
                  value={formbody.referral}
                  onChange={handleChange}
                  required
                />
              </span>
              <box-icon
                name={control.referral ? 'check-circle' : 'x-circle'}
                color={`${control.referral ? '#00A19D' : '#B91646'}`}
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
                <p>Change Password</p>
                <box-icon
                  type="solid"
                  name="right-top-arrow-circle"
                  color={darkmode ? '#ffffffdd' : '#000000dd'}
                >
                </box-icon>
              </button>
            </span>
          </form>
        ) }
      </div>
    </div>
  );
}

export default Forgot;
