/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 06:24:45
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { Form, Card, Button, Toast, Divider, Tabs, List, Empty, InfiniteScroll, Space } from 'antd-mobile'
import styles from './wallect.module.less'
import { info, rechargeRecords, withdrawalRecords } from '@/api/user'
import { useNavigate } from "react-router-dom";
import { formatAmount } from '@/utils/utils'


const tabItems = [
    { key: '0', title: '充值记录' },
    { key: '1', title: '提现记录' },
]


export default function Message() {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // data
  const [activeIndex, setActiveIndex] = useState(0)
  const [page, setPage] = useState(0)
  const [list, setList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [executed, setExecuted] = useState(true);


  
  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    
    let infoData = await info({ userId: userinfo.id })

    localStorage.setItem('userInfo', JSON.stringify(infoData.data.user))

    setUser(infoData.data)
  }

  
  const loadMore = async (type = 0, fake = 0) => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    let res = !type ? await rechargeRecords({ page, size: 10, username: userinfo.username }) : await withdrawalRecords({ page, size: 10, username: userinfo.username})
    setPage(page + 1)


    if(res.data.length == 0){
      // 重置 executed 标志
      return setHasMore(false)
    }

    setList(prev => {
      if([...prev, ...res.data].length >= res.pagination.totalItems){
        setHasMore(false)
      }
      // 重置 executed 标志
      return [...prev, ...res.data]
    })

    // const append = await mockRequest()
    // setHasMore(append.length > 0)
  }

  
  // 充值按钮点击事件
  const handleRecharge = () => {
    navigate('/order/recharge')
  };

  // 提现按钮点击事件
  const handleWithdrawal = () => {
    // 这里可以弹窗或跳转提现页面
    navigate('/order/withdraw')
  };
  


  useEffect(() => {
    console.log(executed, activeIndex, page, list);
    if(!executed && page === 0 && list.length === 0){
      setHasMore(true)

      // 重置 executed 标志
      setExecuted(true);

      // console.log(executed, activeIndex, page, list);
      // loadMore(activeIndex, 1)

    }
  }, [activeIndex, page, executed, list])


  useEffect(() => {
    getData()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '0 0 32px 0' }} className={styles.address}>
        <NavBar title={'我的钱包'} style={{ height: '100px' }}></NavBar>

        <div className={styles.wallect}>
            <Card
                headerStyle={{
                    color: '#1677ff',
                }}
                bodyClassName={styles.customBody}
                title=''
            >
              <h2>Account balance</h2>
              <h1>${ formatAmount(user?.user?.fakeBalance || 0) }</h1>
              <Divider />
              <div className={styles.datas}>
                <div className={styles.data_item}>
                  <h3>{ formatAmount(user?.profit?.total || 0) }</h3>
                  <p>Cumulative income</p>
                </div>
                <div className={styles.data_item}>
                  <h3>{ formatAmount(user?.profit?.today || 0) }</h3>
                  <p>Earnings today</p>
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
                      color: '#333',
                      fontWeight: 600,
                      fontSize: 16,
                      letterSpacing: 1,
                      background: 'rgba(191,161,74,0.10)',
                      boxShadow: '0 2px 8px rgba(191,161,74,0.10)'
                  }}
                  onClick={handleWithdrawal}
                  >
                      提现
                  </Button>
              </Space>
            </Card>


            <Tabs
              activeKey={tabItems[activeIndex].key}
              style={{ '--title-font-size': '18px', '--content-padding': '18px', '--active-line-color': '#333', '--active-title-color': '#333' }}
              onChange={key => {
                const index = tabItems.findIndex(item => item.key === key)
                setActiveIndex(index)
                setList([])
                setExecuted(false)
                setPage(0)
              }}
            >
              {tabItems.map(item => (
                <Tabs.Tab title={item.title} key={item.key} />
              ))}
            </Tabs>


            {
                list.length > 0 ?
                <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                    {list.map(msg => (
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
                        <div className={styles.item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <div>
                                <p>状态：{msg.status}</p>
                                <p>编号：{msg.rechargeNumber ? msg.rechargeNumber : msg.withdrawalNumber}</p>
                                <p>时间：{msg.rechargeTime ? msg.rechargeTime : msg.withdrawalTime}</p>
                            </div>

                            <div className={styles.amount} style={{ color: activeIndex == '0' ? '#ff6767' : '#44a53b'}}>
                                {activeIndex == '1' ? '-' : '+'}  {msg.amount}
                            </div>
                        </div>
                    </List.Item>
                    ))}
                </List>
                :
                <Empty
                    style={{ padding: '64px 0' }}
                    imageStyle={{ width: 128 }}
                    description='暂无数据'
                />
            }

            

        </div>
        <InfiniteScroll loadMore={() => loadMore(activeIndex)} hasMore={hasMore} />
    </div>
  );
} 