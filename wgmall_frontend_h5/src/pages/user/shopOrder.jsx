/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 03:42:37
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { List, Steps, InfiniteScroll, Empty, Card, Space, Button, Toast } from 'antd-mobile'
import { MessageOutline, FileOutline, CheckCircleFill } from 'antd-mobile-icons'
import NavBar from '../../components/NavBar'
import { message } from '@/api/user'
import { shopOrders, summary, payOrder } from '@/api/product'
import { useLocation } from 'umi'

const { Step } = Steps

export default function Message() {
  const [msgList, setMsgList] = useState([])
  const [data, setData] = useState({})
  const [hasMore, setHasMore] = useState(true)
  const [current, setCurrent] = useState({ page: 0 })
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  let type = queryParams.get('type') || 'all'

  const loadMore = async () => {
    console.log('loadMore');
    
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    let res = await shopOrders({ shopId: userinfo.shopId, status: type, page: current.page, size: 10 })
    setCurrent((prev) => ({ page: prev.page + 1 }))

    if (res.data.length == 0) {
      return setHasMore(false)
    }

    console.log(res)

    setMsgList((prev) => {
      if ([...prev, ...res.data].length >= res.pagination.totalItems) {
        setHasMore(false)
      }
      return [...prev, ...res.data]
    })

    // const append = await mockRequest()
    // setHasMore(append.length > 0)
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
        "shopId": userinfo.shopId,
        "orderId": data.order.id,
        "costPrice": data.order.totalWholesale
    })

    if(res.code === 200){
        Toast.show({
            icon: 'scuccess',
            content: res.message,
        })
        getData()
        setCurrent({ page: 0 })
        setMsgList([])
        setTimeout(() => {
            setHasMore(true)
        }, 1000);

    }
  }

  useEffect(() => {
    getData()
  }, [])

  const handleRead = (id) => {
    setMsgList((list) => list.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg)))
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
      <NavBar title={'店铺订单'} style={{ height: '100px' }}></NavBar>

      <Card style={{ fontSize: 12, fontWeight: 700 }}>
        <div style={{ padding: '0 20px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <p>{data.totalAmount}</p>
            <p>总销售额</p>
          </div>
          <div>
            <p>{data.totalProfit}</p>
            <p>总销售盈利 </p>
          </div>
          <div>
            <p>{data.totalWholesale}</p>
            <p>总进货成本</p>
          </div>
        </div>
      </Card>
      {msgList.length > 0 ? (
        <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
          {msgList.map((msg, inex) => (
            <List.Item
              key={inex}
              onClick={() => handleRead(msg.id)}
              style={{
                fontWeight: msg.unread ? 700 : 400,
                background: msg.unread ? 'linear-gradient(90deg, #f5f7fa 0%, #fff 100%)' : '#fff',
                borderRadius: 8,
                margin: '8px 16px',
                boxShadow: msg.unread ? '0 2px 8px rgba(60,80,120,0.06)' : 'none',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <img src={baseApi + msg.order.product.imagePath} alt="" style={{ width: 108, height: 108, borderRadius: 8, marginRight: 16 }} />
                <p style={{ fontSize: 14, width: '250px' }}>{msg.order.product.name} </p>
              </span>

              <div>
                <p> number: x{msg.order.quantity}</p>
                <p> 订单总价: {msg.order.totalAmount}</p>
                <p> 购买时间: {msg.order.createdAt}</p>
                <p> 订单编号: {msg.order.orderNumber}</p>
              </div>
              <div>
                <h2>用户信息:</h2>
                <p>地址: {msg.order.shippingAddress.country + ' ' + msg.order.shippingAddress.province + ' ' + msg.order.shippingAddress.city + ' ' + msg.order.shippingAddress.district + ' ' + msg.order.shippingAddress.street + ' ' + msg.order.shippingAddress.detail}</p>
                <p>姓名: {msg.order.shippingAddress.receiverName}</p>
                <p>手机号码: {msg.order.shippingAddress.receiverPhone}</p>
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
                  title="PENDING"
                  icon={<CheckCircleFill />}
                  description={
                    <Space block direction="vertical">
                      <div>{msg.statusNumber === 1 ? '缺货 需要进货' : '备货充足 无需进货'}</div>
                      <Button color="primary" disabled={msg.statusNumber !== 1} onClick={() => toJinhuo(msg)}>去进货</Button>
                    </Space>
                  }
                />
                <Step title="PRECESSING" icon={<CheckCircleFill />} />
                <Step title="SHIPPED" icon={<CheckCircleFill />} />
                <Step title="WAREHOUSE" icon={<CheckCircleFill />} />
                <Step title="TRANSPORTING" icon={<CheckCircleFill />} />
                <Step title="DELIVERED" icon={<CheckCircleFill />} />
                <Step title="COMPLETED" icon={<CheckCircleFill />} />
              </Steps>
            </List.Item>
          ))}
        </List>
      ) : (
        <Empty style={{ padding: '64px 0' }} imageStyle={{ width: 128 }} description="暂无数据" />
      )}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  )
}
