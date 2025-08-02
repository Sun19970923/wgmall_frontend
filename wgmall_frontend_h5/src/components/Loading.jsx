import React from 'react';
import { Mask, SpinLoading  } from 'antd-mobile';
import './LoadingMask.css'; // 引入自定义样式

const LoadingMask = ({ visible }) => {
  return (
    <Mask visible={visible} className="loading-mask">
      <div className="loading-container">
        <SpinLoading style={{ '--size': '48px' }} />
        <span className="loading-text" >Loading...</span>
      </div>
    </Mask>
  );
};

export default LoadingMask;