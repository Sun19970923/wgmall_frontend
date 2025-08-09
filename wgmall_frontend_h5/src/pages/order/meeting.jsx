import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const BasicLayout = () => {
  const navigate = useNavigate();

  const handleBeforeCloseWindow = () => {
    navigate(-1);
  };

  useEffect(() => {
    const safeParse = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        console.error('userInfo 解析失败:', e, '原始值:', str);
        return null;
      }
    };

    const raw = localStorage.getItem('userInfo');
    if (!raw) {
      console.warn('localStorage 没有 userInfo');
    } else {
      console.log('raw userInfo:', raw);
    }

    const parsed = safeParse(raw);
    console.log('parsed userInfo:', parsed);

    // 直接读取根级 username
    const usernameDirect = parsed?.username;
    const fallback = localStorage.getItem('username') || '智子';
    const username = usernameDirect || fallback;

    console.log('最终使用的 username:', username, {
      usernameDirect,
      fallback,
    });

    if (usernameDirect) {
      localStorage.setItem('username', usernameDirect);
    }

    if (typeof window !== 'undefined' && window._MEIQIA) {
      window._MEIQIA('init');
      window._MEIQIA('beforeCloseWindow', handleBeforeCloseWindow);
      window._MEIQIA('metadata', {
        name: username,
        tel: '25252525',
      });
      window._MEIQIA('showPanel');
    } else {
      console.warn('_MEIQIA 未就绪或不存在');
    }

    return () => {
      window._MEIQIA?.('beforeCloseWindow', null);
    };
  }, [navigate]);


  return null;
};

export default BasicLayout;
