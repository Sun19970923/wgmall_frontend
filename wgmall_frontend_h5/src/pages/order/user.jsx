/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 06:40:55
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PullToRefresh, Button, Toast, Card, Space, TabBar, Badge, Divider, List, Avatar, Tag  } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import { BillOutline, GiftOutline, PayCircleOutline, BankcardOutline } from 'antd-mobile-icons';
import styles from "./user.module.less";
import { formatAmount } from '@/utils/utils'
import { info } from '@/api/user'
import CusttomTabBar from "../../components/CuttomTabber";
import { useEffect } from "react";
import { useState } from "react";
import LoadingMask from '../../components/Loading';

const User = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({})

  
  // 充值按钮点击事件
  const handleRecharge = () => {
    navigate('/order/recharge')
  };

  // 提现按钮点击事件
  const handleWithdrawal = () => {
    // 这里可以弹窗或跳转提现页面
    navigate('/order/withdraw')
  };

  const SignOut = () => {
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    navigate('/login?redirect=order');
  }

  const getData = async (id) => {

    setLoading(true)
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    if(!userinfo){
      return navigate('/login?redirect=order')
    }
    
    let res = await info({ userId: userinfo.id })

    setLoading(false)
    if(res.code !== 200) {

      Toast.show({
        icon: 'fail',
        content: res.message,
      })
      return
    }

    localStorage.setItem('userInfo', JSON.stringify(res.data.user))
    console.log(res, 'res res');
    setUser(res.data.user)
  }




  useEffect(() => {
    getData()
  }, [])

  
  return (
    <div className={styles.indexContainer}>
      <LoadingMask visible={loading} />

      <div className={styles.indexBody}>
        <PullToRefresh
          onRefresh={() => {
            getData()
          }}
        >
            <Space block wrap align="center">
                <Avatar src={require('@/assets/head.jpg')} style={{ borderRadius: '50%', '--size': '52px' }}/>
                <div className={styles.user_right}>
                    {/* <h1>工作账号  <Tag color='warning' style={{ fontSize: '16px', marginLeft: '10px' }}>普通会员</Tag>    </h1> */}
                    <h1>{user.username}</h1>
                    <h2>Invitation code:{user.inviteCode}</h2>
                </div>
            </Space>

            <Card
                style={{
                    maxWidth: '100%',
                    marginTop: '20px',
                    borderRadius: 20,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.25)',
                    background: 'linear-gradient(135deg, #232526 0%, #1a1a1a 60%, #bfa14a 100%)',
                    border: 'none',
                    color: '#fff',
                    position: 'relative',
                    overflow: 'hidden',
                }}
                headerStyle={{
                    borderBottom: 'none',
                    background: 'transparent',
                }}
                bodyStyle={{
                    padding: '30px 28px 22px 28px',
                }}
                >
                {/* 金色装饰条 */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: 8,
                    background: 'linear-gradient(90deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%)',
                    opacity: 0.7,
                }} />
                <div style={{ textAlign: 'left', marginBottom: 28 }}>
                    <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>账户余额</div>
                    <div style={{
                        fontSize: 32,
                        fontWeight: 800,
                        color: '#ffe082',
                        margin: '10px 0 0 0',
                        textShadow: '0 2px 8px rgba(191,161,74,0.18)'
                    }}>
                    $ {formatAmount(user.fakeBalance || 0)}
                    </div>
                </div>
                <Space justify="between" block>
                    <Button
                        color="primary"
                        fill="solid"
                        style={{
                            width: 120,
                            background: 'linear-gradient(90deg, #bfa14a 0%, #ffe082 100%)',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: 16,
                            letterSpacing: 1,
                            color: '#232526',
                            boxShadow: '0 2px 8px rgba(191,161,74,0.10)'
                        }}
                        onClick={handleRecharge}
                    >
                        充值
                    </Button>
                    <Button
                    color="primary"
                    fill="outline"
                    style={{
                        width: 120,
                        borderColor: '#ffe082',
                        color: '#ffe082',
                        fontWeight: 600,
                        fontSize: 16,
                        letterSpacing: 1,
                        background: 'rgba(255,255,255,0.02)',
                        boxShadow: '0 2px 8px rgba(191,161,74,0.10)'
                    }}
                    onClick={handleWithdrawal}
                    >
                        提现
                    </Button>
                </Space>
                {/* 卡号装饰 */}
                <div style={{
                    marginTop: 28,
                    fontSize: 18,
                    letterSpacing: 4,
                    color: '#ffe082',
                    fontFamily: 'monospace',
                    textAlign: 'center',
                    opacity: 0.85,
                    userSelect: 'none'
                }}>
                    
                </div>
            </Card>

             {/* 个人中心功能列表 */}
            <div style={{ maxWidth: '100%', margin: '24px auto 0', borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }} className={styles.listdata}>
                <List>
                    <List.Item prefix={<BillOutline style={{ color: '#bfa14a', fontSize: 32 }} />} onClick={() => navigate('/order/list')}> <span>交易记录</span> </List.Item>
                    {/* <List.Item prefix={<GiftOutline style={{ color: '#bfa14a', fontSize: 32 }} />} onClick={() => alert('邀请礼物')}> <span>邀请记录</span> </List.Item> */}
                    <List.Item prefix={<PayCircleOutline style={{ color: '#bfa14a', fontSize: 32 }} />} onClick={() => navigate('/user/wallect')}> <span>充值记录</span> </List.Item>
                    <List.Item prefix={<BankcardOutline style={{ color: '#bfa14a', fontSize: 32 }} />} onClick={() => navigate('/user/finance')}> <span>贷款</span> </List.Item>
                </List>
            </div>

            <Button
                color="primary" 
                fill="solid"
                style={{
                    width: '100%',
                    background: 'linear-gradient(90deg, #bfa14a 0%, #ffe082 100%)',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: 16,
                    borderRadius: 16,
                    letterSpacing: 1,
                    color: '#232526',
                    margin: 'auto',
                    display: 'block',
                    marginTop: '40px'
                }}
                onClick={SignOut}
            >
                Sign Out
            </Button>

        </PullToRefresh>

        <CusttomTabBar></CusttomTabBar>
      </div>

    </div>
  );
};

export default User;
