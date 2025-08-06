import React, {useState, useEffect} from 'react';
import {Card, Input, Button, Toast} from 'antd-mobile';
import {useNavigate} from "react-router-dom";
import NavBar from "../../components/NavBar"; // 引入 NavBar
import {getUserInfo} from '@/api/ash'; // 引入 getUserInfo
import {rechargeRecordsUser} from '@/api/user'; // 引入 rechargeRecordsUser
import styles from './rechargeP2P.module.less'; // Correct import of styles
import {useTranslation} from 'react-i18next'; // 引入 useTranslation
import LoadingMask from '../../components/Loading'

export default function Recharge() {
    const {t} = useTranslation(); // 获取 t 函数
    const [amount, setAmount] = useState('');
    const [username, setUsername] = useState(''); // 添加 username 状态
    const [phone, setPhone] = useState(''); // 添加 phone 状态
    const [country, setCountry] = useState(''); // 添加 country 状态
    const [fakeBalance, setFakeBalance] = useState(0); // 假设余额是1000 USDT
    const [loading, setLoading] = useState(false); // ✅ 新增 loading 状态
    const navigate = useNavigate();

    useEffect(() => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userinfo) {
            navigate('/login');  // 如果没有登录，直接跳转到登录页面
            return;
        }

        // 使用 getUserInfo 获取用户信息
        getUserInfo(userinfo.id)  // 调用获取用户数据的接口
            .then(response => {
                if (response && response.data) {
                    setUsername(response.data.username);  // 获取到用户名
                    setPhone(response.data.phone); // 获取到手机号
                    setCountry(response.data.country); // 获取到国家
                    setFakeBalance(response.data.fakeBalance); // 假设 API 响应中有 balance 字段
                }
            })
            .catch(err => {
                Toast.show({content: t('rechargep2p.fetchUserInfoFail')}); // 使用多语言翻译
                navigate('/login');  // 如果获取失败，跳转到登录页面
            });
    }, []);  // 只在组件加载时执行一次

    const handleRecharge = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0 || !Number.isInteger(Number(amount))) {
            Toast.show({content: t('rechargep2p.invalidAmount')});
            return;
        }

        setLoading(true); // ✅ 显示加载动画
        try {
            await rechargeRecordsUser({username, amount});
            Toast.show({content: t('rechargep2p.rechargeSuccess')});
            setTimeout(() => navigate('/order/meeting'), 500);
        } catch {
            Toast.show({content: t('rechargep2p.rechargeFail')});
        } finally {
            setLoading(false); // ✅ 请求结束后隐藏加载动画
        }
    };


    // 只允许整数金额
    const handleAmountChange = (val) => {
        // 仅保留数字
        const formattedAmount = val.replace(/[^\d]/g, '');
        setAmount(formattedAmount);
    };


    return (
        <>
            <LoadingMask visible={loading}/> {/* ✅ 全局加载动画 */}

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
                boxSizing: 'border-box'
            }}>
                {/* NavBar */}
                <NavBar title={t('rechargep2p.title')} style={{height: '100px'}}/>

                {/* Main content */}
                <div style={{padding: '32px 0'}} className={styles.content}>
                    <Card
                        style={{
                            maxWidth: 380,
                            margin: '0 auto',
                            borderRadius: 18,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                            background: 'linear-gradient(135deg, #fff 60%, #f5f7fa 100%)',
                        }}
                        bodyStyle={{padding: '36px 24px 32px 24px'}}
                    >
                        <div style={{
                            textAlign: 'center',
                            fontSize: 22,
                            fontWeight: 700,
                            marginBottom: 32,
                            color: '#232526',
                            letterSpacing: 2
                        }}>
                            {t('rechargep2p.recharge')} {/* 使用多语言翻译 */}
                        </div>

                        {/* Amount Input with Balance on the Same Line inside Label */}
                        <div style={{marginBottom: 32}}>
                            <label style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                fontSize: 16,
                                color: '#888',
                                marginBottom: 10,
                                fontWeight: 500
                            }}>
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: 16, color: '#888'}}>
                  {t('rechargep2p.balance')}: {fakeBalance.toFixed(2)} USDT
                </span>
                                </div>
                            </label>
                            <Input
                                placeholder={t('rechargep2p.enterAmount')} // 使用多语言翻译
                                value={amount}
                                onChange={val => handleAmountChange(val)}
                                clearable
                                style={{
                                    width: 'auto',
                                    padding: '6px 12px',
                                    borderRadius: 10,
                                    border: '1.5px solid #bfa14a',
                                    background: '#f8fafc',
                                    color: '#232526',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(191,161,74,0.06)',
                                }}
                                type="text"
                            />
                        </div>

                        {/* Username Input */}
                        <div style={{marginBottom: 32}}>
                            <label style={{
                                display: 'block',
                                fontSize: 16,
                                color: '#888',
                                marginBottom: 10,
                                fontWeight: 500
                            }}>
                                {t('rechargep2p.username')} {/* 使用多语言翻译 */}
                            </label>
                            <Input
                                value={username}
                                disabled  // 用户名不可编辑
                                clearable
                                style={{
                                    width: 'auto',
                                    padding: '6px 12px',
                                    borderRadius: 10,
                                    border: '1.5px solid #bfa14a',
                                    background: '#f0f0f0',
                                    color: '#232526',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(191,161,74,0.06)',
                                }}
                            />
                        </div>

                        {/* Phone Input */}
                        <div style={{marginBottom: 32}}>
                            <label style={{
                                display: 'block',
                                fontSize: 16,
                                color: '#888',
                                marginBottom: 10,
                                fontWeight: 500
                            }}>
                                {t('rechargep2p.phone')} {/* 使用多语言翻译 */}
                            </label>
                            <Input
                                value={phone}
                                disabled  // 手机号不可编辑
                                clearable
                                style={{
                                    width: 'auto',
                                    padding: '6px 12px',
                                    borderRadius: 10,
                                    border: '1.5px solid #bfa14a',
                                    background: '#f0f0f0',
                                    color: '#232526',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(191,161,74,0.06)',
                                }}
                            />
                        </div>

                        {/* Country Input */}
                        <div style={{marginBottom: 32}}>
                            <label style={{
                                display: 'block',
                                fontSize: 16,
                                color: '#888',
                                marginBottom: 10,
                                fontWeight: 500
                            }}>
                                {t('rechargep2p.country')} {/* 使用多语言翻译 */}
                            </label>
                            <Input
                                value={country}
                                disabled  // 国家不可编辑
                                clearable
                                style={{
                                    width: 'auto',
                                    padding: '6px 12px',
                                    borderRadius: 10,
                                    border: '1.5px solid #bfa14a',
                                    background: '#f0f0f0',
                                    color: '#232526',
                                    fontWeight: 600,
                                    boxShadow: '0 2px 8px rgba(191,161,74,0.06)',
                                }}
                            />
                        </div>

                        {/* Confirm Button */}
                        <Button
                            color="primary"
                            size="large"
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 12,
                                fontSize: 18,
                                fontWeight: 700,
                                background: 'linear-gradient(90deg, #bfa14a 0%, #ffe082 100%)',
                                color: '#232526',
                                letterSpacing: 2,
                                boxShadow: '0 2px 8px rgba(191,161,74,0.10)',
                            }}
                            onClick={handleRecharge}
                        >
                            {t('rechargep2p.recharge')} {/* 使用多语言翻译 */}
                        </Button>
                    </Card>
                </div>
            </div>
        </>
    );
}
