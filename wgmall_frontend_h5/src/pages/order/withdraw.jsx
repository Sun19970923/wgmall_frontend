import { useNavigate } from 'react-router-dom';
import styles from './withdraw.module.less';
import NavBar from '../../components/NavBar';
import { useEffect, useState } from 'react';
import { List, Card, Toast } from 'antd-mobile';
import { withdrawalETHHistory, withdrawalTronHistory } from '@/api/user';
import { useTranslation } from 'react-i18next'; // 引入 i18n 的 hook
import { getUserInfo } from '@/api/ash'; // ✅ 引入实时用户信息接口

// 真实支付方式logo图片（可替换为本地或CDN图片地址）
const paymentMethods2 = [
  {
    key: 'wire',
    label: 'withdraw.wireTransfer',
    img: require('@/assets/icon/wiretransfer.jpg'),
  },
  {
    key: 'ach',
    label: 'withdraw.achTransfer',
    img: require('@/assets/icon/ACH-Image.jpeg'),
  },
  {
    key: 'google',
    label: 'withdraw.googlePay',
    img: require('@/assets/icon/GooglePay_Lockup.width-1300.png'),
  },
  {
    key: 'apple',
    label: 'withdraw.applePay',
    img: require('@/assets/icon/images.png'),
  },
  {
    key: 'paypal',
    label: 'withdraw.paypal',
    img: require('@/assets/icon/paypal.png'),
  },
  {
    key: 'P2P',
    label: 'withdraw.p2p',
    img: require('@/assets/icon/crypto.jpg'),
  },
    {
    key: 'visa',
    label: 'withdraw.visa',
    img: require('@/assets/icon/visa.png'),
  },
  {
    key: 'zelle',
    label: 'withdraw.zelle',
    img: require('@/assets/icon/images22.png'),
  },
  {
    key: 'wise',
    label: 'withdraw.wise',
    img: require('@/assets/icon/wise-product-logo-1024x1024-1.jpg'),
  },
];

const User = () => {
  const { t } = useTranslation(); // 使用 t 方法获取翻译
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [eth, setETH] = useState('');
  const [tron, setTron] = useState('');

  // 跳转到 P2P 提现页面
  const handleSelect2 = async (key) => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUser || !storedUser.id) {
      Toast.show({ content: 'login' });
      navigate('/login');
      return;
    }

    try {
      const res = await getUserInfo(storedUser.id); // ✅ 实时获取用户信息
      const user = res.data;

      if (key === 'P2P') {
        // ✅ 检查是否设置了 Tron 钱包地址
        if (!user.tronWalletAddress) {
          Toast.show({ content: t('withdraw.pleaseSetWallet') }); // 可选提示语
          navigate('/order/withdrawWalletSet'); // ✅ 跳转到钱包设置页面
        } else {
          navigate('/order/withdrawP2P'); // ✅ 进入 P2P 提现页
        }
      } else if (key === 'visa') {
        if (user.useBank === 1) {
          navigate('/order/withdrawBank');
        } else {
          Toast.show({
            icon: 'fail',
            content: t('withdraw.regionNotSupported'),
          });
        }
      } else {
        Toast.show({
          icon: 'fail',
          content: t('withdraw.regionNotSupported'),
        });
      }
    } catch (err) {
      Toast.show({ content: '信息获取失败，请重新登录' });
      navigate('/login');
    }
  };


  useEffect(() => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userinfo);
    getData();
    getTron();
  }, []);

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'));
    let res = await withdrawalETHHistory({ userId: userinfo.id });
    if (res.code === 200) {
      setETH(res.data || '');
    }
  };

  const getTron = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'));
    let res = await withdrawalTronHistory({ userId: userinfo.id });
    if (res.code === 200) {
      setTron(res.data || '');
    }
  };

  return (
    <div className={styles.indexContainer}>
      <NavBar title={t('withdraw.title')} style={{ height: '100px' }} />

      <div className={styles.indexBody}>
        <div style={{ padding: '32px 0' }}>
          <Card
            style={{
              maxWidth: 400,
              margin: '0 auto',
              borderRadius: 18,
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '28px 0 8px 0' }}
          >
            <div
              style={{
                textAlign: 'center',
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 18,
                color: '#232526',
                letterSpacing: 2,
              }}
            >
              {t('withdraw.selectMethod')}
            </div>
            <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
              {paymentMethods2.map((item) => (
                <List.Item
                  key={item.key}
                  prefix={
                    <img
                      src={item.img}
                      alt={item.label}
                      style={{
                        width: 32,
                        height: 32,
                        objectFit: 'contain',
                        borderRadius: 6,
                        background: '#fff',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        padding: 2,
                      }}
                    />
                  }
                  onClick={() => handleSelect2(item.key)}
                  style={{
                    fontSize: 18,
                    fontWeight: 500,
                    color: '#232526',
                    borderRadius: 12,
                    margin: '8px 16px',
                    background: '#f8fafc',
                    boxShadow: '0 1px 4px rgba(191,161,74,0.04)',
                  }}
                  arrow={false}
                >
                  {t(item.label)}
                </List.Item>
              ))}
            </List>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default User;
