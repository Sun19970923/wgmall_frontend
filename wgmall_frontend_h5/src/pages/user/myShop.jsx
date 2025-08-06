/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-06
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 我的店铺页面，加入防止重复点击和LoadingMask
 */
import { PullToRefresh, Button, Toast, Card, Space, Mask, List, Empty, Ellipsis } from "antd-mobile";
import styles from "./myShop.module.less";
import { formatAmount } from '@/utils/utils';
import { useEffect, useState } from "react";
import { products, removeProduct, editPrice } from '@/api/product';
import NavBar from "../../components/NavBar";
import LoadingMask from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ShopHome = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState({});
    const [msgList, setMsgList] = useState([]);

    // 获取店铺商品数据
    const getData = async () => {
        setLoading(true);
        let { shopId } = JSON.parse(localStorage.getItem('userInfo'));
        let pro = await products(shopId);
        setMsgList(pro.data);
        setLoading(false);
    };

    // 下架商品
    const downProduct = async (value) => {
        if (loading) return;
        setLoading(true);

        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let res = await removeProduct({
            shopId: userInfo.shopId,
            productId: value.id,
        });

        if (res.code === 200) {
            Toast.show({ icon: 'success', content: t('myshop.toastRemoveSuccess') });
            await getData();
        }
        setLoading(false);
    };

    // 编辑价格
    const edit = async (data) => {
        setVisible(true);
        setCurrent(data);
    };

    // 提交价格修改
    const submit = async () => {
        if (loading) return;
        if (!value) {
            Toast.show({ icon: 'fail', content: t('myshop.enterPricePrompt') });
            return;
        }
        setLoading(true);

        let userInfo = JSON.parse(localStorage.getItem('userInfo'));
        let res = await editPrice({
            shopId: userInfo.shopId,
            productId: current.id,
            newPrice: value,
        });

        if (res.code === 200) {
            setVisible(false);
            Toast.show({ icon: 'success', content: t('myshop.priceUpdateSuccess') });
            await getData();
        }
        setLoading(false);
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className={styles.indexContainer}>
            <LoadingMask visible={loading} />

            {/* 修改价格弹窗 */}
            <Mask visible={visible} onMaskClick={() => setVisible(false)}>
                <div className={styles.overlayContent}>
                    <Card>
                        <h1>{t('myshop.editPrice')}</h1>
                        <br />
                        <div className={styles.content}>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder={t('myshop.enterNewPrice')}
                            />
                            <br />
                            <div
                                className={styles.button}
                                onClick={() => submit()}
                                style={{
                                    background: loading ? '#ccc' : '#fb7701',
                                    pointerEvents: loading ? 'none' : 'auto'
                                }}
                            >
                                {loading ? t('myshop.submitting') : t('myshop.submit')}
                            </div>
                        </div>
                    </Card>
                </div>
            </Mask>

            <div className={styles.indexBody}>
                <NavBar title={t('myshop.title')} />

                {msgList.length > 0 ? (
                    <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                        {msgList.map((msg) => (
                            <List.Item
                                key={msg.id}
                                style={{
                                    fontWeight: msg.unread ? 700 : 400,
                                    background: msg.unread ? 'linear-gradient(90deg, #f5f7fa 0%, #fff 100%)' : '#fff',
                                    borderRadius: 8,
                                    margin: '8px 16px',
                                    boxShadow: msg.unread ? '0 2px 8px rgba(60,80,120,0.06)' : 'none',
                                }}
                            >
                                <div style={{ height: '120px', display: 'flex', justifyContent: 'space-between' }}>
                                    {/* 商品图片 */}
                                    <div style={{ width: '40%', height: '100%' }}>
                                        <img src={baseApi + msg.imagePath} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                                    </div>

                                    {/* 商品信息 */}
                                    <div style={{ width: '58%', padding: '10px 0' }}>
                                        {msg?.name && (
                                            <Ellipsis direction="end" content={msg?.name} rows={2} style={{ fontSize: '18px' }} />
                                        )}
                                        <br />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <p style={{ color: '#fb7701', fontSize: '18px' }}>
                                                ${formatAmount(msg?.price || 0)}
                                            </p>
                                            <div>
                                                <button
                                                    onClick={() => downProduct(msg)}
                                                    disabled={loading}
                                                    style={{
                                                        color: '#fff',
                                                        background: loading ? '#ccc' : '#fb7701',
                                                        padding: '4px 8px',
                                                        border: 'none',
                                                        fontSize: '14px',
                                                        borderRadius: '8px',
                                                        cursor: loading ? 'not-allowed' : 'pointer',
                                                    }}
                                                >
                                                    {loading ? t('myshop.processing') : t('myshop.remove')}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        ))}
                    </List>
                ) : (
                    <Empty
                        style={{ padding: '64px 0' }}
                        imageStyle={{ width: 128 }}
                        description={t('myshop.noData')}
                    />
                )}
            </div>
        </div>
    );
};

export default ShopHome;
