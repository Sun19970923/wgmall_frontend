/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-16 21:52:05
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useNavigate } from "react-router-dom";
import styles from "./recharge.module.less";
import { formatAmount } from '@/utils/utils'
import NavBar from "../../components/NavBar";
import { useEffect } from "react";
import { useState } from "react";
import { List, Card, Toast } from 'antd-mobile';


// 真实支付方式logo图片（可替换为本地或CDN图片地址）
const paymentMethods = [
    {
      key: 'wire',
      label: 'Wire Transfer',
      img: require('@/assets/icon/wiretransfer.jpg'),
    },
    {
      key: 'ach',
      label: 'ACH Transfer',
      img: require('@/assets/icon/ACH-Image.jpeg'),
    },
    {
      key: 'google',
      label: 'Google Pay',
      img: require('@/assets/icon/GooglePay_Lockup.width-1300.png'),
    },
    {
      key: 'apple',
      label: 'Apple Pay',
      img: require('@/assets/icon/images.png'),
    },
    {
      key: 'paypal',
      label: 'Paypal',
      img: require('@/assets/icon/GooglePay_Lockup.width-1300.png'),
    },
    {
      key: 'P2P',
      label: 'P2P',
      img: require('@/assets/icon/crypto.jpg'),
    },
    {
      key: 'zelle',
      label: 'Zelle',
      img: require('@/assets/icon/images22.png'),
    },
    {
      key: 'wise',
      label: 'Wise',
      img: require('@/assets/icon/wise-product-logo-1024x1024-1.jpg'),
    },
  ];
  

const User = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({})

  const goOrder = () => {
    navigate('/order/rechargeP2P')
  };

  // 选择支付方式
  const handleSelect = (key) => {
    if (key === 'P2P') {
      goOrder();
    } else {
      Toast.show({
        icon: 'fail',
        content: '你的地区因为税务问题不支持',
      });
    }
  };


  useEffect(() => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log(userinfo, 'userinfo');
    setUser(userinfo)
  }, [])

  
  return (
    <div className={styles.indexContainer}>
        <NavBar title={'Recharge'} style={{ height: '100px' }}></NavBar>
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
                        选择支付方式
                    </div>
                    <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                    {paymentMethods.map((item) => (
                        <List.Item
                            key={item.key}
                            prefix={
                                <img
                                    src={item.img}
                                    alt={item.label}
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
                        {item.label}
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
