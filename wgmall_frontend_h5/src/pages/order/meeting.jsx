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

    // 多路径取 username：优先级自上而下
    const usernameFromNested =
      parsed?.user?.username ||
      parsed?.address?.user?.username ||
      parsed?.address?.user?.user?.username ||
      parsed?.user?.user?.username; // 额外保险

    const fallback = localStorage.getItem('username') || '智子';
    const username = usernameFromNested || fallback;

    console.log('最终使用的 username:', username, {
      usernameFromNested,
      fallback,
    });

    if (usernameFromNested) {
      localStorage.setItem('username', usernameFromNested);
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
