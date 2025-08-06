import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Toast } from 'antd-mobile';
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { getUserInfo, getBankInfo, setBankInfo, submitBankWithdrawalRecord } from '@/api/ash';
import styles from './rechargeP2P.module.less';
import LoadingMask from '../../components/Loading';
import { useTranslation } from 'react-i18next';

export default function WithdrawBank() {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [fakeBalance, setFakeBalance] = useState(0);
    const [fundPassword, setFundPassword] = useState('');

    // 银行卡信息
    const [bankAccount, setBankAccount] = useState('');
    const [realName, setRealName] = useState('');
    const [bankName, setBankName] = useState('');
    const [cvv, setCvv] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const [editable, setEditable] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userinfo) {
            navigate('/login');
            return;
        }
        setUserId(userinfo.id);

        getUserInfo(userinfo.id)
            .then(response => {
                if (response && response.data) {
                    setUsername(response.data.username);
                    setFakeBalance(response.data.fakeBalance || 0);

                    getBankInfo(userinfo.id)
                        .then(bankRes => {
                            if (bankRes && bankRes.data) {
                                const { bankAccount, realName, bankName, cvv, expiryDate } = bankRes.data;
                                setBankAccount(bankAccount || '');
                                setRealName(realName || '');
                                setBankName(bankName || '');
                                setCvv(cvv || '');
                                setExpiryDate(expiryDate || '');
                                setEditable(!bankAccount || !realName || !bankName || !cvv || !expiryDate);
                            }
                        })
                        .catch(() => Toast.show({ content: t('withdrawbank.toast_bankInfoFailed') }));
                }
            })
            .catch(() => {
                Toast.show({ content: t('withdrawbank.toast_userInfoFailed') });
                navigate('/login');
            });
    }, [navigate, t]);

    // 提现金额输入限制
    const handleAmountChange = (val) => {
        const intVal = val.replace(/\D/g, '');
        setAmount(intVal);
    };

    const handleWithdraw = async () => {
        if (!amount || isNaN(amount) || Number(amount) <= 0 || !Number.isInteger(Number(amount))) {
            Toast.show({ content: t('withdrawbank.toast_invalidAmount') });
            return;
        }
        if (Number(amount) > fakeBalance) {
            Toast.show({ content: t('withdrawbank.toast_exceedBalance') });
            return;
        }
        if (!fundPassword) {
            Toast.show({ content: t('withdrawbank.toast_needFundPassword') });
            return;
        }

        setLoading(true);

        try {
            if (editable) {
                if (!bankAccount || !realName || !bankName || !cvv || !expiryDate) {
                    Toast.show({ content: t('withdrawbank.toast_incompleteBankInfo') });
                    setLoading(false);
                    return;
                }
                await setBankInfo(userId, bankAccount, realName, bankName, cvv, expiryDate);
                Toast.show({ content: t('withdrawbank.toast_saveSuccess') });
            }

            const res = await submitBankWithdrawalRecord(
                username, amount, fundPassword, bankName, bankAccount, realName, cvv, expiryDate
            );

            if (res.code === 200) {
                Toast.show({ content: t('withdrawbank.toast_submitSuccess') });
                setTimeout(() => navigate('/order/meeting'), 500);
            }
            else if (res.code === 400) {
                Toast.show({ content: res.message || t('withdrawbank.toast_abnormalStatus') });
            }
            else {
                Toast.show({ content: res.message || t('withdrawbank.toast_operationFailed') });
            }
        } catch (error) {
            Toast.show({ content: t('withdrawbank.toast_operationFailed') });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <LoadingMask visible={loading} />
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
                boxSizing: 'border-box'
            }}>
                <NavBar title={t('withdrawbank.title')} style={{ height: '100px' }} />
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
                        {/* 余额 */}
                        <div style={{ marginBottom: 32 }}>
                            <label style={labelStyle}>
                                {t('withdrawbank.balance')}: {fakeBalance.toFixed(2)} USD
                            </label>
                            <form autoComplete="off">
                                <Input
                                    type="number"
                                    inputMode="numeric"
                                    placeholder={t('withdrawbank.inputAmountPlaceholder')}
                                    value={amount}
                                    onChange={handleAmountChange}
                                    clearable
                                    style={inputStyleEditable}
                                    name={`fake-${Date.now()}`}
                                    autoComplete="new-password"
                                />
                            </form>
                        </div>

                        {/* 银行卡信息 */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>{t('withdrawbank.bankName')}</label>
                            <Input value={bankName} onChange={val => setBankName(val)} disabled={!editable}
                                   style={editable ? inputStyleEditable : inputStyle} />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>{t('withdrawbank.bankAccount')}</label>
                            <Input value={bankAccount} onChange={val => setBankAccount(val)} disabled={!editable}
                                   style={editable ? inputStyleEditable : inputStyle} />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>{t('withdrawbank.realName')}</label>
                            <Input value={realName} onChange={val => setRealName(val)} disabled={!editable}
                                   style={editable ? inputStyleEditable : inputStyle} />
                        </div>

                        {/* CVV 和 过期日期 */}
                        <div style={{ marginBottom: 24, display: 'flex', gap: '12px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>{t('withdrawbank.cvv')}</label>
                                <Input value={cvv} onChange={val => setCvv(val)} disabled={!editable}
                                       style={editable ? inputStyleEditable : inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>{t('withdrawbank.expiryDate')}</label>
                                <Input value={expiryDate} onChange={val => setExpiryDate(val)} disabled={!editable}
                                       style={editable ? inputStyleEditable : inputStyle} />
                            </div>
                        </div>

                        {/* 资金密码 */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={labelStyle}>{t('withdrawbank.fundPassword')}</label>
                            <form autoComplete="off">
                                <Input
                                    type="password"
                                    placeholder={t('withdrawbank.inputFundPassword')}
                                    value={fundPassword}
                                    onChange={val => setFundPassword(val)}
                                    clearable
                                    style={inputStyleEditable}
                                    name={`fund-pass-${Date.now()}`}
                                    autoComplete="new-password"
                                />
                            </form>
                        </div>

                        {/* 提现按钮 */}
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
                            {t('withdrawbank.confirmWithdraw')}
                        </Button>
                    </Card>
                </div>
            </div>
        </>
    );
}

// 公共样式
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
