import React, { useEffect, useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from '../../components/NavBar';
import { Form, Input, Button, Toast, Card, Mask, ImageUploader, DatePickerView } from 'antd-mobile';
import styles from './finance.module.less';
import { info, loanNum, repay } from '@/api/user';
import { useNavigate } from 'react-router-dom';
import { formatAmount } from '@/utils/utils';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

export default function Finance() {
    const { t } = useTranslation(); // 使用 t 函数来获取翻译文本
    const navigate = useNavigate();
    const [user, setUser] = useState({}); // data
    const [visible, setVisible] = useState(0); // data
    const [type, setType] = useState(0); // data
    const [number, setNumber] = useState(''); // data

    const getData = async () => {
        let userinfo = JSON.parse(localStorage.getItem('userInfo'));
        setUser(userinfo);

        let res = await info({ userId: userinfo.id });
        if (res.code == 200) setUser(res.data.user);
    }

    const submit = async () => {
        let res = type == 0 ? await loanNum({ userId: user.id, loanAmount: number }) : await repay({ userId: user.id, repayAmount: number });

        if (res.code == 200) {
            Toast.show({
                content: res.message,
                icon: 'success'
            });
            setVisible(false);
            setNumber('');
            getData();
        }
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div style={{ padding: '0 0 32px 0' }} className={styles.address}>
            <NavBar title={t('finance.myLoan')} style={{ height: '100px' }}></NavBar>

            <Mask visible={visible} onMaskClick={() => setVisible(false)}>
                <div className={styles.overlayContent}>
                    <Card>
                        <h1>{type == 0 ? t('finance.loanRequest') : t('finance.repay')}</h1>

                        <div className={styles.content}>
                            <input
                                type="number"
                                value={number}
                                onChange={(e) => setNumber(e.target.value)}
                                placeholder={t('finance.enterAmount')}
                            />
                            <div className={styles.button} onClick={() => submit()}>{t('finance.submit')}</div>
                        </div>
                    </Card>
                </div>
            </Mask>

            <div className={styles.finance}>
                {
                    !user.borrowable ?
                        <Card>
                            <div className={styles.title}>
                                <span>{t('finance.loanRequest')}</span>
                            </div>

                            <div className={styles.content}>
                                {t('finance.noLoanAvailable')}
                            </div>

                            <div className={styles.number}>
                                ?????
                            </div>

                            <div className={styles.button} onClick={() => {
                                navigate('/user/approve');
                            }}>
                                {t('finance.applyLoan')}
                            </div>
                        </Card>
                        :
                        <Card>
                            <div className={styles.title}>
                                <span>{t('finance.loanRequest')}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div>
                                    <div className={styles.content}>
                                        {t('finance.yourCredit')}
                                    </div>

                                    <div className={styles.number}>
                                        $ {formatAmount(user.credit || 0)}
                                    </div>
                                </div>

                                <div>
                                    <div className={styles.content}>
                                        {t('finance.yourDebt')}
                                    </div>

                                    <div className={styles.number}>
                                        $ {formatAmount(user.debtAmount || 0)}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                                <div
                                    className={styles.button}
                                    style={{ background: '#f5f7fa', color: '#000' }}
                                    onClick={() => {
                                        setType(0);
                                        setVisible(true);
                                    }}
                                >
                                    {t('finance.borrow')}
                                </div>
                                <div
                                    className={styles.button}
                                    onClick={() => {
                                        setVisible(true);
                                        setType(1);
                                    }}
                                >
                                    {t('finance.repay')}
                                </div>
                            </div>
                        </Card>
                }
            </div>

            <br />
            <br />
        </div>
    );
}
