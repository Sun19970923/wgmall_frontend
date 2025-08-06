import React, { useMemo, useState, useEffect } from 'react';
import { List, Slider, InfiniteScroll, Empty, Ellipsis, Mask, Card, Toast } from 'antd-mobile';
import NavBar from "../../components/NavBar";
import { availableProducts, listProduct, priceRange } from "@/api/product";
import { useNavigate } from 'react-router-dom';
import styles from './product.module.less';
import { splitNumberByProgress } from '@/utils/utils';
import { useTranslation } from 'react-i18next';

export default function Product() {
    const { t } = useTranslation();
    const [msgList, setMsgList] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [current, setCurrent] = useState({ page: 0 });
    const [visible, setVisible] = useState(false);
    const [marks, setMarks] = useState(null);
    const [number, setNumber] = useState(0);
    const [productId, setProductId] = useState(0);
    const navigate = useNavigate();

    // ✅ 页面挂载时滚动到顶部
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // ✅ 分页加载
    const loadMore = async () => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));
        const nextPage = current.page + 1;

        try {
            const res = await availableProducts({
                shopId: userinfo.shopId,
                page: nextPage,
                size: 10
            });

            const newList = res.data || [];
            setMsgList(prev => [...prev, ...newList]);
            setCurrent({ page: nextPage });

            if (newList.length < 10) {
                setHasMore(false);
            }
        } catch (err) {
            Toast.show({ content: t('product.loadFailed') });
            setHasMore(false);
        }
    };

    const upProduct = async (value) => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));
        setProductId(value.id);

        const res = await priceRange({
            shopId: userinfo.shopId,
            productId: value.id
        });

        setMarks(splitNumberByProgress(res.data.minPrice, res.data.maxPrice, 5));
        setVisible(true);
    };

    // ✅ 实际价格
    const realPrice = useMemo(() => {
        return marks ? marks[number] : 0;
    }, [number, marks]);

    const submit = async () => {
        const userinfo = JSON.parse(localStorage.getItem('userInfo'));

        const res = await listProduct({
            shopId: userinfo.shopId,
            productId,
            chosenPrice: realPrice
        });

        if (res.code === 200) {
            Toast.show({ icon: 'success', content: res.message });
            setVisible(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)' }}>
            {/* ✅ 固定顶部 */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 1000,
                    background: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
            >
                <NavBar title={t('product.title')} style={{ height: '100px' }} />
            </div>

            <div style={{ height: '50px' }} />
            {/* 弹窗面板 */}
            <Mask visible={visible} onMaskClick={() => setVisible(false)}>
                <div className={styles.overlayContent}>
                    <Card>
                        <h1>{t('product.listProduct')}</h1>
                        <br /><br />

                        <div className={styles.content}>
                            {marks && (
                                <Slider
                                    marks={marks}
                                    ticks
                                    onAfterChange={value => setNumber(value)}
                                />
                            )}

                            <br /><br /><br />
                            <div className={styles.button} onClick={submit}>
                                {t('product.submit')}
                            </div>
                        </div>
                    </Card>
                </div>
            </Mask>

            {/* 商品列表 */}
            {msgList.length > 0 ? (
                <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                    {msgList.map(msg => (
                        <List.Item
                            key={msg.id}
                            description={<span style={{ color: '#666', fontSize: 14 }}>{msg.content}</span>}
                            extra={<span style={{ color: '#aaa', fontSize: 13 }}>{msg.time}</span>}
                            style={{
                                fontWeight: msg.unread ? 700 : 400,
                                background: msg.unread ? 'linear-gradient(90deg, #f5f7fa 0%, #fff 100%)' : '#fff',
                                borderRadius: 8,
                                margin: '8px 16px',
                                boxShadow: msg.unread ? '0 2px 8px rgba(60,80,120,0.06)' : 'none',
                            }}
                        >
                            <div style={{ height: '120px', display: 'flex', justifyContent: 'space-between' }}>
                                <div style={{ width: '40%', height: '100%' }}>
                                    <img
                                        src={baseApi + msg.imagePath}
                                        alt=""
                                        style={{ width: '100%', height: '100%', borderRadius: 8 }}
                                    />
                                </div>

                                <div style={{ width: '58%', padding: '10px 0' }}>
                                    {msg?.name && (
                                        <Ellipsis direction='end' content={msg?.name} rows={2} style={{ fontSize: '18px' }} />
                                    )}
                                    <br />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ color: '#fb7701', fontSize: '18px' }}>
                                            $ {Number(msg?.costPrice).toFixed(2)}
                                            <del style={{ color: '#333', fontSize: '12px', marginLeft: 4 }}>
                                                {Number(msg?.price).toFixed(2)}
                                            </del>
                                        </p>
                                        <button
                                            onClick={() => upProduct(msg)}
                                            style={{
                                                color: '#fff',
                                                background: '#fb7701',
                                                padding: '4px 8px',
                                                border: 'none',
                                                fontSize: '14px',
                                                borderRadius: '8px'
                                            }}
                                        >
                                            {t('product.list')}
                                        </button>
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
                    description={t('product.noData')}
                />
            )}

            {/* 无限滚动加载 */}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
        </div>
    );
}
