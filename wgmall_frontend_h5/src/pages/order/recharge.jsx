import { useNavigate } from "react-router-dom";
import styles from "./recharge.module.less";
import { formatAmount } from '@/utils/utils';
import NavBar from "../../components/NavBar";
import { useEffect, useState } from "react";
import { List, Card, Toast } from 'antd-mobile';
import { useTranslation } from 'react-i18next'; // 引入 useTranslation
import {getUserInfo} from '../../api/ash'
// 真实支付方式logo图片（可替换为本地或CDN图片地址）
const paymentMethods = [
  {
    key: 'wire',
    label: 'wireTransfer',  // 留下原始 key，后续在 JSX 中用 t 替换
    img: require('@/assets/icon/wiretransfer.jpg'),
  },
  {
    key: 'ach',
    label: 'achTransfer',
    img: require('@/assets/icon/ACH-Image.jpeg'),
  },
  {
    key: 'google',
    label: 'googlePay',
    img: require('@/assets/icon/GooglePay_Lockup.width-1300.png'),
  },
  {
    key: 'apple',
    label: 'applePay',
    img: require('@/assets/icon/images.png'),
  },
  {
    key: 'paypal',
    label: 'paypal',
    img: require('@/assets/icon/paypal.png'),
  },
  {
    key: 'P2P',
    label: 'p2p',
    img: require('@/assets/icon/crypto.jpg'),
  },
  {
    key: 'visa',
    label: 'visa',
    img: require('@/assets/icon/visa.png')
  },
  {
    key: 'zelle',
    label: 'zelle',
    img: require('@/assets/icon/images22.png'),
  },
  {
    key: 'wise',
    label: 'wise',
    img: require('@/assets/icon/wise-product-logo-1024x1024-1.jpg'),
  },
];

const User = () => {
  const { t } = useTranslation(); // 获取 t 函数
  const navigate = useNavigate();

  const [user, setUser] = useState({});

  const goOrder = () => {
    navigate('/order/rechargeP2P');
  };

  // 选择支付方式
  const handleSelect = async (key) => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUser || !storedUser.id) {
      Toast.show({ content: '请先登录' });
      navigate('/login');
      return;
    }

    // 只处理 P2P 和 visa
    if (key === 'P2P') {
      navigate('/order/rechargeP2P');
    } else if (key === 'visa') {
      try {
        const res = await getUserInfo(storedUser.id);
        const user = res.data;
        if (user.useBank === 1) {
          navigate('/order/rechargeBank');
        } else {
          Toast.show({
            icon: 'fail',
            content: t('recharge.regionNotSupported'),
          });
        }
      } catch (err) {
        Toast.show({ content: 'Info Failed' });
        navigate('/login');
      }
    } else {
      Toast.show({
        icon: 'fail',
        content: t('recharge.regionNotSupported'),
      });
    }
  };


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUser || !storedUser.id) {
      navigate('/login');
      return;
    }

    // ✅ 直接从接口实时获取最新用户信息
    getUserInfo(storedUser.id)
        .then(res => {
          if (res && res.data) {
            setUser(res.data);
          } else {
            navigate('/login');
          }
        })
        .catch(() => {
          Toast.show({ content: '获取用户信息失败，请重新登录' });
          navigate('/login');
        });
  }, [navigate]);

  return (
    <div className={styles.indexContainer}>
      <NavBar title={t('recharge.title')} style={{ height: '100px' }}></NavBar>
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
            <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 18, color: '#232526', letterSpacing: 2 }}>
              {t('recharge.selectMethod')} {/* 翻译标题 */}
            </div>
            <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
              {paymentMethods.map((item) => (
                <List.Item
                  key={item.key}
                  prefix={
                    <img
                      src={item.img}
                      alt={t(`recharge.${item.label}`)} // 使用 t 获取翻译文本
                      style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 2 }}
                    />
                  }
                  onClick={() => handleSelect(item.key)}
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
                  {t(`recharge.${item.label}`)} {/* 使用 t 获取翻译文本 */}
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
