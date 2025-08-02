/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 22:03:00
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\layouts\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Outlet } from "umi";
import { useNavigate, matchRoutes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import router from "@/routes";
import "lib-flexible";
import { NoticeBar, SafeArea } from "antd-mobile";
import { AppOutline, HeartOutline, UserOutline } from "antd-mobile-icons";
import "normalize.css/normalize.css"; //全局引入
import styles from "./index.less";
import { SimpleWebSocket } from '../utils/utils';
import '../i18n'; // 导入国际化配置


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


  // 快速切换语言的功能
  const quickLanguageSwitch = (language) => {
    i18n.changeLanguage(language);
    localStorage.setItem('selectedLanguage', language);
  };




  const wsFn = (ws, id) => {
    ws.connect();
    // ws.onOpen(() => {
    //   ws.send({
    //     "action": "send",
    //     "senderId": id,
    //   });
    // });
    
    // 监听消息
    ws.onMessage(msg => {
      // 处理服务端推送的消息
      console.log('收到消息：', msg);
      if(msg?.data){
        setVisible(true)
        if(msg.type === 'order'){
          setContent(msg.data.count)
        }
        if(msg.type === "balance"){
          setContent(msg.data.amount)
        }
        setType(msg.type)
      }
    });


    // 关闭连接
    // ws.close();
  }

  const createWebSocket = (id) => {
    const ws = new SimpleWebSocket('wss://api.xxzh.cc/ws/chat?userId='+id)
    wsFn(ws, id)
  }


  useEffect(() => {
    setInterval(() => {
      let userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUserInfo(userInfo?.id || 0);
    }, 2000)
  }, [])


  useEffect(() => {
    if (userInfo) {
      createWebSocket(userInfo || 0)
    }
  }, [userInfo])


  useEffect(() => {
    console.log(router, location.pathname);
    const routes = matchRoutes(router.routes, location.pathname); // 返回匹配到的路由数组对象，每一个对象都是一个路由对象
    const pathArr = [];
    if (routes !== null) {
      routes.forEach((item) => {
        const path = item.route.path;
        if (path) {
          pathArr.push(path);
        }
      });
    }
    setDefaultSelectedKeys(pathArr);
    setDefaultOpenKeys(pathArr);
    setIsInit(true);
  }, [location.pathname]);
  if (!isInit) {
    return null;
  }

  const setRouteActive = (value) => {
    navigate(value);
  };

  const tabs = [
    {
      key: "/home",
      title: "首页",
      icon: <AppOutline fontSize="25" />,
    },
    {
      key: "/about",
      title: "关于",
      icon: <HeartOutline fontSize="25" />,
    },

    {
      key: "/my",
      title: "我的",
      icon: <UserOutline fontSize="25" />,
    },
  ];
  return (
    <>
      <div className={styles.app}>
        <SafeArea position="top" />

        {
          visible &&
          (type === 'balance' ?
            <div className={styles.popup} onClick={() => {
              navigate('/order/matic')
              setVisible(false)
            }}>
              <img src={require('@/assets/img.png')} alt="" />
              <span>${content}</span>
            </div>
            :
            <div className={styles.popup} onClick={() => {
              navigate('/order/matic')
              setVisible(false)
            }}>
              <img src={require('@/assets/img2.png')} alt="" />
              <b>{content}</b>
            </div>)
        }
        {/* {
          visible && 
          <NoticeBar style={{ '--font-size': '22px', '--height': '60px', '--icon-font-size': '28px', 'position': 'fixed', 'left': 0, 'top': 0, 'width': '100%', 'zIndex': 9999}} content={content} color='alert' />
        } */}
        <Outlet />
      </div>
    </>
  );
}
