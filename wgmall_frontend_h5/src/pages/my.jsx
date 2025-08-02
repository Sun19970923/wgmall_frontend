import React from 'react';
import { Tag, Grid, List, Toast, Badge, Avatar, Button } from 'antd-mobile';
import {
  PayCircleOutline,
  ShopbagOutline,
  BankcardOutline,
  UserOutline,
  FileOutline,
  HeartOutline,
  EnvironmentOutline,
  CustomerServiceOutline,
  AddSquareOutline,
  AppstoreOutline,
  SetOutline,
  TranslationOutline,
  MessageOutline,
} from 'antd-mobile-icons';
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { info } from '@/api/user';
import { useEffect, useState } from "react";
import LoadingMask from '../components/Loading';
import styles from '@/assets/css/my.less'
import { useTranslation } from 'react-i18next';


const topActions = [
  {
    key: 'wallet',
    label: '我的钱包',
    icon: <PayCircleOutline style={{ fontSize: 32, color: '#333' }} />,
    onClick: (navigate) => navigate('/user/wallect'),
  },
  {
    key: 'shop',
    label: '我的店铺',
    icon: <ShopbagOutline style={{ fontSize: 32, color: '#333' }} />,
    onClick: (navigate) => {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      if (userInfo.buyerOrSaler) {
        return navigate('/user/shopHome')
      }
      Toast.show({
        icon: 'fail',
        content: '您还没有申请开店',
      })
      setTimeout(() => {
        navigate('/user/apply')
      }, 2000);

    },
  },
  {
    key: 'loan',
    label: '我的贷款',
    icon: <BankcardOutline style={{ fontSize: 32, color: '#333' }} />,
    onClick: (navigate) => navigate('/user/finance'),
  },
];


const routerLink = (navigate, item) => {
  navigate(item.link)
  
}


// type = 0 所有都有  1 = 买家才有  2 = 卖家才有
const listItems = [
  { key: 'order', label: '我的订单', type: 0, link: '/user/order', icon: <FileOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
  { key: 'wish', label: '心愿单',  type: 0, link: '/user/wishlistList', icon: <HeartOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
  { key: 'address', label: '地址',  type: 0, link: '/user/address', icon: <EnvironmentOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
  { key: 'support', label: '客服支持',  type: 0, link: '/order/meeting', icon: <UserOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
  { key: 'open-shop', label: '开店申请',  type: 1, link: '/user/apply', icon: <AddSquareOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
  { key: 'loan-apply', label: '贷款申请',  type: 0, link: '/user/approve', icon: <AppstoreOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
  { key: 'product', label: '商品',  type: 2, link: '/user/product', icon: <SetOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
  { key: 'lang', label: '语言',  type: 0, link: '/LanguageSwitchPage', icon: <UserOutline style={{ color: '#ff4d4f', fontSize: 24 }} />, onClick: (navigate, item) => routerLink(navigate, item) },
];


export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // data
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();



  const getData = async () => {
    setLoading(true)
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    if(!userinfo) {
      return navigate('/login')
    }

    let infoData = await info({ userId: userinfo.id })

    localStorage.setItem('userInfo', JSON.stringify(infoData.data.user))

    setUser(infoData.data.user)
    setLoading(false)
  }


  useEffect(() => {
    getData()
  }, [])



  
  return (
    <div style={{ minHeight: '100vh', padding: '0 0 32px 0' }}>
      <NavBar title={t('user.title')} style={{ height: '100px' }}></NavBar>

      <LoadingMask visible={loading} />


      {/* 顶部白色背景+用户信息 */}
      <div style={{
        background: '#fff',
        padding: '24px 0 24px 0',
        marginBottom: 4,
        boxShadow: '0 4px 16px rgba(255,77,79,0.08)',
      }}>
        <div style={{ margin: '0 auto', position: 'relative', padding: '1em 2em' }}>
          {/* 用户信息行 */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <Avatar src={require('@/assets/header.png')} fit="fill" style={{ '--size': '60px', '--border-radius': '50%' }} onClick={() => navigate('/my')} />

            <div style={{ flex: 1, marginLeft: '2em' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#232526', marginBottom: 11 }}>{user.username} {user.buyerOrSaler ? <Tag style={{ fontSize: '14px' }} color='warning'>卖家认证</Tag> : ''}  </div>
              <div style={{ fontSize: 13, color: '#ff4d4f', fontWeight: 600 }}>邀请码：{user.inviteCode}</div>
            </div>
            <div style={{ marginLeft: 8, cursor: 'pointer' }} onClick={() => navigate('/user/message') }>
              <Badge content={user.hasUnreadMessages} style={{ '--right': '0px', '--top': '2px', '--color': 'red', 'width': '8px', 'height': '8px', '--border-radius': '50%', '--font-size': '10px' }}>
                <MessageOutline style={{ fontSize: 30 }} />
              </Badge>
            </div>
          </div>

          {/* 三大功能区块 */}
          <Grid columns={3} gap={0}>
            {topActions.map(item => (
              <Grid.Item key={item.key}>
                <div onClick={() => item.onClick(navigate)} style={{ textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    margin: '0 auto 8px auto',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {item.icon}
                  </div>
                  <div style={{ color: '#333', fontWeight: 700, fontSize: 12 }}>{item.label}</div>
                </div>
              </Grid.Item>
            ))}
          </Grid>
        </div>
      </div>
      {/* 功能列表 */}
      <div style={{ maxWidth: 400, margin: '0 auto',  overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(255,77,79,0.04)' }}>
        <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
          {listItems.map(item => (
            (!user.buyerOrSaler && item.type === 2) ?
            null
            :
            <List.Item
              key={item.key}
              prefix={item.icon}
              onClick={() => item.onClick(navigate, item)}
              style={{
                fontSize: 17,
                fontWeight: 500,
                color: '#232526',
                borderRadius: 12,
                margin: '4px 12px',
                background: '#fff',
              }}
              arrow
            >
              {item.label}
            </List.Item>
          ))}
        </List>
      </div>

      <Button type="primary" htmlType="submit" onClick={() => navigate('/login')} className={styles.submit}>
          Sign out
      </Button>
    </div>
  );
}
