import React, { useState, useEffect } from 'react';
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
import LoadingMask from '../components/Loading';
import styles from '@/assets/css/my.less';
import { useTranslation } from 'react-i18next';

const topActions = [
  {
    key: 'wallet',
    labelKey: 'my.myWallet', // 保存键名
    icon: <PayCircleOutline style={{ fontSize: 32, color: '#333' }} />,
    onClick: (navigate) => navigate('/user/wallect'),
  },
  {
    key: 'shop',
    labelKey: 'my.myShop',
    icon: <ShopbagOutline style={{ fontSize: 32, color: '#333' }} />,
    onClick: (navigate) => {
      let userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo.buyerOrSaler) {
        return navigate('/user/shopHome');
      }
      Toast.show({
        icon: 'success',
        content: 'Wating for you!',
      });
      setTimeout(() => {
        navigate('/user/apply');
      }, 2000);
    },
  },
  {
    key: 'loan',
    labelKey: 'my.myLoan',
    icon: <BankcardOutline style={{ fontSize: 32, color: '#333' }} />,
    onClick: (navigate) => navigate('/user/finance'),
  },
];

const routerLink = (navigate, item) => {
  navigate(item.link);
};

const listItems = [
  { key: 'order', labelKey: 'my.myOrder', type: 0, link: '/user/order', icon: <FileOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
  { key: 'wish', labelKey: 'my.wishlist', type: 0, link: '/user/wishlistList', icon: <HeartOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
  { key: 'address', labelKey: 'my.address', type: 0, link: '/user/address', icon: <EnvironmentOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
  { key: 'support', labelKey: 'my.customerSupport', type: 0, link: '/order/meeting', icon: <UserOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
  { key: 'open-shop', labelKey: 'my.applyForShop', type: 1, link: '/user/apply', icon: <AddSquareOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
  { key: 'loan-apply', labelKey: 'my.loanApplication', type: 0, link: '/user/approve', icon: <AppstoreOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
  { key: 'product', labelKey: 'my.products', type: 2, link: '/user/product', icon: <SetOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
  { key: 'lang', labelKey: 'my.language', type: 0, link: '/LanguageSwitchPage', icon: <UserOutline style={{ color: '#ff4d4f', fontSize: 24 }} /> },
];

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(); // 获取 t 函数

  const getData = async () => {
    setLoading(true);
    let userinfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userinfo) {
      return navigate('/login');
    }

    let infoData = await info({ userId: userinfo.id });

    localStorage.setItem('userInfo', JSON.stringify(infoData.data.user));

    setUser(infoData.data.user);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', padding: '0 0 32px 0' }}>
      <NavBar title={t('my.title')} style={{ height: '100px' }}></NavBar>

      <LoadingMask visible={loading} />

      <div style={{
        background: '#fff',
        padding: '24px 0 24px 0',
        marginBottom: 4,
        boxShadow: '0 4px 16px rgba(255,77,79,0.08)',
      }}>
        <div style={{ margin: '0 auto', position: 'relative', padding: '1em 2em' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
            <Avatar src={require('@/assets/header.png')} fit="fill" style={{ '--size': '60px', '--border-radius': '50%' }} onClick={() => navigate('/my')} />

            <div style={{ flex: 1, marginLeft: '2em' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#232526', marginBottom: 11 }}>
                {user.username} 
                {user.buyerOrSaler ? <Tag style={{ fontSize: '14px' }} color='warning'>{t('my.sellerCertification')}</Tag> : ''}  
              </div>
              <div style={{ fontSize: 13, color: '#ff4d4f', fontWeight: 600 }}>
                {t('my.inviteCode')}: {user.inviteCode}
              </div>
            </div>
            <div style={{ marginLeft: 8, cursor: 'pointer' }} onClick={() => navigate('/user/message')}>
              <Badge content={user.hasUnreadMessages} style={{ '--right': '0px', '--top': '2px', '--color': 'red', 'width': '8px', 'height': '8px', '--border-radius': '50%', '--font-size': '10px' }}>
                <MessageOutline style={{ fontSize: 30 }} />
              </Badge>
            </div>
          </div>

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
                  <div style={{ color: '#333', fontWeight: 700, fontSize: 12 }}>{t(item.labelKey)}</div> {/* 使用动态翻译 */}
                </div>
              </Grid.Item>
            ))}
          </Grid>
        </div>
      </div>

      <div style={{ maxWidth: 400, margin: '0 auto', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(255,77,79,0.04)' }}>
        <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
          {listItems.map(item => (
            (!user.buyerOrSaler && item.type === 2) ? null : 
            <List.Item
              key={item.key}
              prefix={item.icon}
              onClick={() => routerLink(navigate, item)}
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
              {t(item.labelKey)} {/* 动态翻译 */}
            </List.Item>
          ))}
        </List>
      </div>

      <Button type="primary" htmlType="submit" onClick={() => navigate('/login')} className={styles.submit}>
        {t('my.signOut')}
      </Button>
    </div>
  );
}
