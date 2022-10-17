import React from 'react';
import { useSelector } from 'react-redux';
import style from '../../styles/components/helpers/loading.css';

function Loading() {
  const { darkmode } = useSelector((state) => state);

  return (
    <div className={`${style.spinner} ${darkmode ? style.dark : null}`}>
      <div className={style['double-bounce1']}></div>
      <div className={style['double-bounce2']}></div>
    </div>
  );
}

export default Loading;
