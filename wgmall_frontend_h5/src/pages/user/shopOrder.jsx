/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-06
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 店铺订单页
 */
import React, {useEffect, useState} from 'react'
import {List, Steps, InfiniteScroll, Empty, Card, Space, Button, Toast} from 'antd-mobile'
import {CheckCircleFill} from 'antd-mobile-icons'
import NavBar from '../../components/NavBar'
import {shopOrders, summary, payOrder} from '@/api/product'
import {useLocation} from 'umi'
import {useTranslation} from 'react-i18next'

const {Step} = Steps

export default function Message() {
    const {t} = useTranslation()
    const [msgList, setMsgList] = useState([])
    const [data, setData] = useState({})
    const [hasMore, setHasMore] = useState(true)
    const [current, setCurrent] = useState({page: 0})
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    let type = queryParams.get('type') || 'all'

    const loadMore = async () => {
        let userinfo = JSON.parse(localStorage.getItem('userInfo'))
        let res = await shopOrders({shopId: userinfo.shopId, status: type, page: current.page, size: 10})
        setCurrent((prev) => ({page: prev.page + 1}))

        if (res.data.length === 0) {
            return setHasMore(false)
        }

        setMsgList((prev) => {
            if ([...prev, ...res.data].length >= res.pagination.totalItems) {
                setHasMore(false)
            }
            return [...prev, ...res.data]
        })
    }

    const getData = async () => {
        let userinfo = JSON.parse(localStorage.getItem('userInfo'))
        let res = await summary(userinfo.shopId)
        setHasMore(true)
        setData(res.data)
    }

    const toJinhuo = async (data) => {
        let userinfo = JSON.parse(localStorage.getItem('userInfo'))

        let res = await payOrder({
            shopId: userinfo.shopId,
            orderId: data.order.id,
            costPrice: data.order.totalWholesale,
        })

        if (res.code === 200) {
            Toast.show({
                icon: 'success',
                content: res.message,
            })
            getData()
            setCurrent({page: 0})
            setMsgList([])
            setTimeout(() => {
                setHasMore(true)
            }, 1000)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const handleRead = (id) => {
        setMsgList((list) => list.map((msg) => (msg.id === id ? {...msg, unread: false} : msg)))
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)',
            padding: '0 0 32px 0'
        }}>
            <NavBar title={t('shoporder.title')} style={{height: '100px'}}></NavBar>

            <Card style={{fontSize: 12, fontWeight: 700}}>
                <div style={{padding: '0 20px', display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                        <p>{data.totalAmount}</p>
                        <p>{t('shoporder.totalSales')}</p>
                    </div>
                    <div>
                        <p>{data.totalProfit}</p>
                        <p>{t('shoporder.totalProfit')}</p>
                    </div>
                    <div>
                        <p>{data.totalWholesale}</p>
                        <p>{t('shoporder.totalWholesale')}</p>
                    </div>
                </div>
            </Card>

            {msgList.length > 0 ? (
                <List style={{'--border-top': 'none', '--border-bottom': 'none'}}>
                    {msgList.map((msg, index) => (
                        <List.Item
                            key={index}
                            onClick={() => handleRead(msg.id)}
                            style={{
                                fontWeight: msg.unread ? 700 : 400,
                                background: msg.unread ? 'linear-gradient(90deg, #f5f7fa 0%, #fff 100%)' : '#fff',
                                borderRadius: 8,
                                margin: '8px 16px',
                                boxShadow: msg.unread ? '0 2px 8px rgba(60,80,120,0.06)' : 'none',
                            }}
                        >
<span style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
  <img
      src={msg?.order?.product?.imagePath ? baseApi + msg.order.product.imagePath : require('@/assets/head.jpg')}
      alt=""
      style={{width: 108, height: 108, borderRadius: 8, marginRight: 16}}
  />
  <p style={{fontSize: 14, maxWidth: 'calc(100% - 140px)', marginRight: 16}}>
    {msg?.order?.product?.name || t('shoporder.unavailableProduct')}
  </p>
</span>

                            <div style={{fontSize: '14px', lineHeight: '1.8'}}>
                                <p>{t('shoporder.quantity')}: x{msg.order.quantity}</p>
                                <p>{t('shoporder.orderTotal')}: {msg.order.totalAmount}</p>
                                <p>
                                    {t('shoporder.purchaseTime')}: {new Date(msg.order.createdAt).toLocaleString('zh-CN', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                }).replace(/\//g, '-')}
                                </p>
                                <p>{t('shoporder.orderNumber')}: {msg.order.orderNumber}</p>
                            </div>

                            <Steps
                                direction="vertical"
                                style={{
                                    '--title-font-size': '17px',
                                    '--description-font-size': '15px',
                                    '--indicator-margin-right': '12px',
                                    '--icon-size': '22px',
                                }}
                                current={msg.statusNumber - 1}
                            >
                                <Step
                                    title={t('shoporder.pending')}
                                    icon={<CheckCircleFill/>}
                                    description={
                                        <Space block direction="vertical">
                                            <div>{msg.statusNumber === 1 ? t('shoporder.pendingStock') : t('shoporder.inStock')}</div>
                                            <Button color="primary" disabled={msg.statusNumber !== 1}
                                                    onClick={() => toJinhuo(msg)}>
                                                {t('shoporder.goRestock')}
                                            </Button>
                                        </Space>
                                    }
                                />
                                <Step title={t('shoporder.processing')} icon={<CheckCircleFill/>}/>
                                <Step title={t('shoporder.shipped')} icon={<CheckCircleFill/>}/>
                                <Step title={t('shoporder.warehouse')} icon={<CheckCircleFill/>}/>
                                <Step title={t('shoporder.transporting')} icon={<CheckCircleFill/>}/>
                                <Step title={t('shoporder.delivered')} icon={<CheckCircleFill/>}/>
                                <Step title={t('shoporder.completed')} icon={<CheckCircleFill/>}/>
                            </Steps>
                        </List.Item>
                    ))}
                </List>
            ) : (
                <Empty style={{padding: '64px 0'}} imageStyle={{width: 128}} description={t('shoporder.noData')}/>
            )}
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
        </div>
    )
}
