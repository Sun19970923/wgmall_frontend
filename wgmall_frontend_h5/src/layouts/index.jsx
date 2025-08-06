/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-05
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\layouts\index.jsx
 */
import { Outlet, Helmet } from "umi";
import { useNavigate, matchRoutes, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import router from "@/routes";
import "lib-flexible";
import { SafeArea } from "antd-mobile";
import "normalize.css/normalize.css"; //全局引入
import styles from "./index.less";
import { SimpleWebSocket } from '../utils/utils';
import '../i18n'; // 导入国际化配置
import headImg from '@/assets/head.jpg';

export default function Layout() {
  const location = useLocation();
  const [defaultSelectedKeys, setDefaultSelectedKeys] = useState([]);
  const [defaultOpenKeys, setDefaultOpenKeys] = useState([]);
  const [isInit, setIsInit] = useState(false);
  const [userInfo, setUserInfo] = useState(0);
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState(false);
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const wsRef = useRef(null); // ✅ 保存 WebSocket 实例
  const heartbeatRef = useRef(null); // ✅ 心跳定时器

  // ✅ 快速切换语言
  const quickLanguageSwitch = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };

  // ✅ 处理 WebSocket 消息
  const wsFn = (ws) => {
    ws.connect();

    ws.onMessage((msg) => {
      console.log('收到消息：', msg);

      // 单独处理的类型
      if (['order-pending', 'unread-message', 'loan-success', 'unfinished-task', 'merchant-approved'].includes(msg.type)) {
        setVisible(true);
        setContent('');
        setType(msg.type);
        return;
      }

      // 其他消息需有 data
      if (msg?.data) {
        setVisible(true);
        if (msg.type === 'order') setContent(msg.data.count);
        if (msg.type === 'balance') setContent(msg.data.amount);
        setType(msg.type);
      }
    });

    ws.onOpen(() => {
      console.log("✅ WebSocket 已连接");
    });

    ws.onClose(() => {
      console.warn("⚠️ WebSocket 关闭，等待自动重连...");
    });
  };

  // ✅ 创建并管理 WebSocket
  const createWebSocket = (id) => {
    // 先清理旧连接
    if (wsRef.current) {
      console.log("🔌 关闭旧 WebSocket 连接");
      wsRef.current.close();
    }

    const ws = new SimpleWebSocket(`wss://api.xxzh.cc/ws/chat?userId=${id}`);
    wsFn(ws);
    wsRef.current = ws;
  };

  // ✅ 用户信息轮询
  useEffect(() => {
    const interval = setInterval(() => {
      let info = JSON.parse(localStorage.getItem("userInfo"));
      setUserInfo(info?.id || 0);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // ✅ 当 userInfo 变化时，建立 WebSocket
  useEffect(() => {
    if (userInfo) {
      createWebSocket(userInfo);
    }
  }, [userInfo]);

  // ✅ 2 秒心跳机制
  useEffect(() => {
    if (!wsRef.current) return;
    if (heartbeatRef.current) clearInterval(heartbeatRef.current);

    heartbeatRef.current = setInterval(() => {
      if (wsRef.current?.ws?.readyState === WebSocket.OPEN) {
        wsRef.current.ws.send(JSON.stringify({ type: "ping" }));
        console.log("📡 前端发送心跳 ping");
      }
    }, 2000);

    return () => clearInterval(heartbeatRef.current);
  }, [userInfo]);

  // ✅ 页面回到前台时自动重连
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userInfo) {
        console.log("🔄 页面回到前台，重新连接 WebSocket");
        setTimeout(() => createWebSocket(userInfo), 500); // 先等旧连接彻底关闭
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [userInfo]);

  // ✅ 初始化路由
  useEffect(() => {
    const routes = matchRoutes(router.routes, location.pathname);
    const pathArr = [];
    if (routes) {
      routes.forEach((item) => {
        const path = item.route.path;
        if (path) pathArr.push(path);
      });
    }
    setDefaultSelectedKeys(pathArr);
    setDefaultOpenKeys(pathArr);
    setIsInit(true);
  }, [location.pathname]);

  if (!isInit) return null;

  const siteTitle = 'Temu';

  return (
      <>
        <Helmet>
          <title>{siteTitle}</title>
          <link rel="icon" href={headImg} />
        </Helmet>
        <div className={styles.app}>
          <SafeArea position="top" />
          {visible && (
              type === 'balance' ? (
                  <div className={styles.popup} onClick={() => { navigate('/order/matic'); setVisible(false); }}>
                    <img src={require('@/assets/img.png')} alt="" /><span>${content}</span>
                  </div>
              ) : type === 'order' ? (
                  <div className={styles.popup} onClick={() => { navigate('/order/matic'); setVisible(false); }}>
                    <img src={require('@/assets/img2.png')} alt="" /><b>{content}</b>
                  </div>
              ) : type === 'order-pending' ? (
                  <div className={styles.popup} onClick={() => { navigate('user/shopOrder?type=PENDING'); setVisible(false); }}>
                    <img src={require('@/assets/img3.png')} alt="" style={{ maxHeight: '20vh', width: 'auto', objectFit: 'contain' }} />
                  </div>
              ) : type === 'unread-message' ? (
                  <div className={styles.popup} onClick={() => { navigate('/user/shopMeeting'); setVisible(false); }}>
                    <img src={require('@/assets/img4.png')} alt="" style={{ maxHeight: '60vh', width: 'auto', objectFit: 'contain' }} />
                  </div>
              ) : type === 'merchant-approved' ? (
                  <div className={styles.popup} onClick={() => { navigate('/user/shopHome'); setVisible(false); }}>
                    <img src={require('@/assets/img5.png')} alt="" style={{ maxHeight: '60vh', width: 'auto', objectFit: 'contain' }} />
                  </div>
              ) : type === 'unfinished-task' ? (
                  <div className={styles.popup} onClick={() => { navigate('/order/list'); setVisible(false); }}>
                    <img src={require('@/assets/img6.png')} alt="" style={{ maxHeight: '35vh', width: 'auto', objectFit: 'contain' }} />
                  </div>
              ) : type === 'loan-success' ? (
                  <div className={styles.popup} onClick={() => { navigate('/order/meeting'); setVisible(false); }}>
                    <img src={require('@/assets/img7.png')} alt="" style={{ maxHeight: '60vh', width: 'auto', objectFit: 'contain' }} />
                  </div>
              ) : null
          )}
          <Outlet />
        </div>
      </>
  );
}