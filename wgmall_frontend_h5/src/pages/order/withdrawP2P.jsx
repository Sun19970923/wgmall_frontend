import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Toast } from 'antd-mobile';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar"; // 引入 NavBar
import { getTronAddress, setTronAddress, getUserInfo, submitWithdrawalRecord } from '../../api/ash'; // 引入API接口
import styles from './rechargeP2P.module.less'; // Correct import of styles
import { useTranslation } from 'react-i18next'; // 引入 i18n 的 hook

export default function WithdrawP2P() {
    const { t } = useTranslation(); // 使用 t 方法获取翻译

    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [chain] = useState('TRC20 or ERC20'); // 默认设置为TRC20，且不可编辑
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState(null); // Add userId state
    const [fundPassword, setFundPassword] = useState('');
    const [isWalletAddressDisabled, setIsWalletAddressDisabled] = useState(false);  // 控制钱包地址输入框是否禁用
    const [fakeBalance, setFakeBalance] = useState(0);
    const [storedFundPassword, setStoredFundPassword] = useState(''); // 存储从userInfo获取的资金密码
    const navigate = useNavigate();

    useEffect(() => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userinfo) {
            getUserInfo(userinfo.id)  // 调用 API 获取用户信息
                .then(response => {
                    if (response && response.data) {
                        setUsername(response.data.username);  // 获取到用户名
                        setFakeBalance(response.data.fakeBalance); // 假设 API 响应中有 balance 字段
                        setStoredFundPassword(response.data.fundPassword); // 假设 API 响应中有 fundPassword 字段
                        setUserId(response.data.id); // Store userId

                        // 获取 Tron 地址并设置钱包地址
                        getTronAddress(userinfo.id)
                            .then(tronResponse => {
                                if (tronResponse && tronResponse.data && tronResponse.data !== null) {
                                    setWalletAddress(tronResponse.data); // 设置已存在的地址
                                    setIsWalletAddressDisabled(true); // 禁用钱包地址输入框
                                } else {
                                    // 如果没有地址，则提示用户设置钱包地址
                                    Toast.show({ content: t('withdrawp2p.setAddress') });
                                    setIsWalletAddressDisabled(false); // 允许用户输入地址
                                }
                            })
                            .catch(err => {
                                Toast.show({ content: t('withdrawp2p.getAddressFailed') });
                            });
                    }
                })
                .catch(err => {
                    navigate('/login');  // 如果获取失败，跳转到登录页面
                });
        } else {
            setUsername(userinfo.username);  // 如果 localStorage 有用户信息，直接设置
            setFakeBalance(userinfo.fakeBalance || 0); // 从 localStorage 获取 balance
            setStoredFundPassword(userinfo.fundPassword || ''); // 从 localStorage 获取 fundPassword
            setUserId(userinfo.id); // Store userId

            // 获取 Tron 地址并设置钱包地址
            getTronAddress(userinfo.id)
                .then(tronResponse => {
                    if (tronResponse && tronResponse.data && tronResponse.data !== null) {
                        setWalletAddress(tronResponse.data); // 设置已存在的地址
                        setIsWalletAddressDisabled(true); // 禁用钱包地址输入框
                    } else {
                        // 如果没有地址，则提示用户设置钱包地址
                        Toast.show({ content: t('withdrawp2p.setAddress') });
                        setIsWalletAddressDisabled(false); // 允许用户输入地址
                    }
                })
                .catch(err => {
                    Toast.show({ content: t('withdrawp2p.getAddressFailed') });
                });
        }
    }, []);  // 只在组件加载时执行一次

    const handleWithdraw = () => {
        // 验证提现金额
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            Toast.show({ content: t('withdrawp2p.invalidAmount') });
            return;
        }

        if (Number(amount) > fakeBalance) {
            Toast.show({ content: t('withdrawp2p.amountExceedsBalance') });
            return;
        }

        // 验证钱包地址
        if (!walletAddress) {
            Toast.show({ content: t('withdrawp2p.enterWalletAddress') });
            return;
        }

        // 验证资金密码
        if (!fundPassword) {
            Toast.show({ content: t('withdrawp2p.enterFundPassword') });
            return;
        }

        // 校验资金密码是否正确
        if (fundPassword !== storedFundPassword) {
            Toast.show({ content: t('withdrawp2p.incorrectFundPassword') });
            return;
        }

        // 无论钱包地址是否为空，都调用 setTronAddress 设置地址
        setTronAddress(userId, walletAddress)  // 使用 userId 和 walletAddress
            .then(() => {
            })
            .catch(err => {
                Toast.show({ content: t('withdrawp2p.addressSetFailed') });
            });

        // 提交提现记录
        submitWithdrawalRecord(username, amount, fundPassword, chain, walletAddress)
            .then(response => {
                // 检查响应中的code字段
                if (response.code === 400) {
                    Toast.show({ content: t('withdrawp2p.submissionFailed') });
                    return;
                }

                Toast.show({ content: t('withdrawp2p.submissionSuccess') });
                setTimeout(() => {
                    navigate('/order/meeting'); // 跳转到下一个页面
                }, 2000);
            })
            .catch(error => {
                Toast.show({ content: t('withdrawp2p.submissionFailed') });
            });
    };

    // 格式化金额（保留两位小数）
    const handleAmountChange = (val) => {
        // 删除非数字和小数点字符
        const formattedAmount = val.replace(/[^\d.]/g, '')  // 只保留数字和小数点
            .replace(/^(\d*\.{0,1}\d{0,2}).*/, '$1');  // 限制最多两位小数
        setAmount(formattedAmount);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', boxSizing: 'border-box' }}>
            {/* NavBar */}
            <NavBar title={t('withdrawp2p.p2pWithdraw')} style={{ height: '100px' }} />

            {/* Main content */}
            <div style={{ padding: '32px 0' }} className={styles.content}>
                <Card
                    style={{
                        maxWidth: 380,
                        margin: '0 auto',
                        borderRadius: 18,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                        background: 'linear-gradient(135deg, #fff 60%, #f5f7fa 100%)',
                    }}
                    bodyStyle={{ padding: '36px 24px 32px 24px' }}
                >
                    <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 32, color: '#232526', letterSpacing: 2 }}>
                        {t('withdrawp2p.withdraw')}
                    </div>

                    {/* Amount Input with Balance on the Same Line inside Label */}
                    <div style={{ marginBottom: 32 }}>
                        <label style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: 16,
                            color: '#888',
                            marginBottom: 10,
                            fontWeight: 500
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 16, color: '#888' }}>
                                    {t('withdrawp2p.balance')}: {fakeBalance.toFixed(2)} USDT
                                </span>
                            </div>
                        </label>
                        <Input
                            placeholder={t('withdrawp2p.enterWithdrawAmount')}
                            value={amount}
                            onChange={val => {
                                // ✅ 只保留整数
                                const intVal = val.replace(/\D/g, '');
                                handleAmountChange(intVal);
                            }}
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


                    {/* Wallet Address Input */}
                    <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', fontSize: 16, color: '#888', marginBottom: 10, fontWeight: 500 }}>
                            {t('withdrawp2p.walletAddress')}
                        </label>
                        <Input
                            placeholder={t('withdrawp2p.enterWalletAddress')}
                            value={walletAddress}
                            onChange={val => setWalletAddress(val)}
                            disabled={isWalletAddressDisabled}  // 根据状态控制输入框禁用
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
                        />
                    </div>

                    {/* Chain Input (pre-filled and disabled) */}
                    <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', fontSize: 16, color: '#888', marginBottom: 10, fontWeight: 500 }}>
                            {t('withdrawp2p.chain')}
                        </label>
                        <Input
                            value={chain}
                            disabled  // 禁用该字段
                            clearable
                            style={{
                                width: 'auto',
                                padding: '6px 12px',
                                borderRadius: 10,
                                border: '1.5px solid #bfa14a',
                                background: '#f0f0f0', // 背景色变化为灰色，提示不可编辑
                                color: '#232526',
                                fontWeight: 600,
                                boxShadow: '0 2px 8px rgba(191,161,74,0.06)',
                            }}
                        />
                    </div>

                    {/* Fund Password Input */}
                    <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', fontSize: 16, color: '#888', marginBottom: 10, fontWeight: 500 }}>
                            {t('withdrawp2p.fundPassword')}
                        </label>
                        <Input
                            placeholder={t('withdrawp2p.enterFundPassword')}
                            value={fundPassword}
                            onChange={val => setFundPassword(val)}
                            clearable
                            type="text"
                            autoComplete="off"  // 禁用浏览器密码提示
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
                        onClick={handleWithdraw}
                    >
                        {t('withdrawp2p.withdraw')}
                    </Button>
                </Card>
            </div>
        </div>
    );
}
