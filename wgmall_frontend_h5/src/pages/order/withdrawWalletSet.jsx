import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Toast } from 'antd-mobile';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { getUserInfo, setTronAddress } from '@/api/ash';
import styles from './rechargeP2P.module.less';
import { useTranslation } from 'react-i18next';

export default function WithdrawWalletSet() {
    const { t } = useTranslation();
    const [walletAddress, setWalletAddress] = useState('');
    const [fundPassword, setFundPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [storedFundPassword, setStoredFundPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userinfo) {
            navigate('/login');
            return;
        }
        setUserId(userinfo.id);
        setStoredFundPassword(userinfo.fundPassword || '');
    }, [navigate]);

    const handleSave = async () => {
        if (!walletAddress) {
            Toast.show({ content: t('withdrawwalletset.toast_incompleteBankInfo') });
            return;
        }
        if (!fundPassword) {
            Toast.show({ content: t('withdrawwalletset.toast_needFundPassword') });
            return;
        }
        if (fundPassword !== storedFundPassword) {
            Toast.show({ content: t('withdrawwalletset.toast_wrongFundPassword') });
            return;
        }

        try {
            await setTronAddress(userId, walletAddress);
            Toast.show({ content: t('withdrawwalletset.toast_saveSuccess') });
            setTimeout(() => navigate('/order/withdraw'), 800);
        } catch (err) {
            Toast.show({ content: t('withdrawwalletset.toast_operationFailed') });
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
            boxSizing: 'border-box'
        }}>
            <NavBar title={t('withdrawwalletset.title')} style={{ height: '100px' }} />
            <div style={{ padding: '10px 0' }} className={styles.content}>
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

                    {/* 钱包地址 */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>{t('withdrawwalletset.walletAddress')}</label>
                        <Input
                            value={walletAddress}
                            onChange={val => setWalletAddress(val)}
                            placeholder={t('withdrawwalletset.enterWalletAddress')}
                            clearable
                            style={inputStyleEditable}
                            type="text"
                            name={`wallet-address-${Date.now()}`}
                            autoComplete="off"
                        />
                    </div>

                    {/* 链类型 */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>{t('withdrawwalletset.chainType')}</label>
                        <Input
                            value="TRC20 or ERC20"
                            disabled
                            style={inputStyle}
                        />
                    </div>

                    {/* 资金密码 */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={labelStyle}>{t('withdrawwalletset.fundPassword')}</label>
                        <Input
                            type="password"
                            value={fundPassword}
                            onChange={val => setFundPassword(val)}
                            placeholder={t('withdrawwalletset.enterFundPassword')}
                            clearable
                            style={inputStyleEditable}
                        />
                    </div>

                    {/* 保存按钮 */}
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
                        onClick={handleSave}
                    >
                        {t('withdrawwalletset.btnSave')}
                    </Button>
                </Card>
            </div>
        </div>
    );
}

// 样式不动你的一点 ✅
const inputStyle = {
    width: 'auto',
    padding: '6px 12px',
    borderRadius: 10,
    border: '1.5px solid #bfa14a',
    background: '#f0f0f0',
    color: '#232526',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(191,161,74,0.06)',
};

const inputStyleEditable = {
    ...inputStyle,
    background: '#f8fafc',
};

const labelStyle = {
    display: 'block',
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
    fontWeight: 500,
};
