/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-15 16:37:49
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 21:08:04
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\meeting.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom";


const BasicLayout = () => {
  const navigate = useNavigate();

  const handleBeforeCloseWindow = () => {
    navigate(-1);
  }

  useEffect(() => {
    window._MEIQIA('init')
    window._MEIQIA('beforeCloseWindow', handleBeforeCloseWindow);
    window._MEIQIA('metadata', {
        name: '智子', // 美洽默认字段
        tel: '25252525', // 自定义字段
    });
    window._MEIQIA?.('showPanel')
  }, []);
};

export default BasicLayout;
