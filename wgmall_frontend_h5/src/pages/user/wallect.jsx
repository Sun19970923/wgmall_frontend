import React, { useEffect, useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { Form, Card, Button, Toast, Divider, Tabs, List, Empty, InfiniteScroll, Space } from 'antd-mobile'
import styles from './wallect.module.less'
import { info, rechargeRecords, withdrawalRecords } from '@/api/user'
import { useNavigate } from "react-router-dom";
import { formatAmount } from '@/utils/utils'
import { useTranslation } from 'react-i18next'; // 引入 i18n 的 hook

const tabItems = [
  { key: '0', title: 'wallet.rechargeRecords' },
  { key: '1', title: 'wallet.withdrawalRecords' },
]

export default function Message() {
  const { t } = useTranslation(); // 使用 t 方法获取翻译

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

    let res = !type ? await rechargeRecords({ page, size: 10, username: userinfo.username }) : await withdrawalRecords({ page, size: 10, username: userinfo.username })
    setPage(page + 1)

    if (res.data.length == 0) {
      // 重置 executed 标志
      return setHasMore(false)
    }

    setList(prev => {
      if ([...prev, ...res.data].length >= res.pagination.totalItems) {
        setHasMore(false)
      }
      // 重置 executed 标志
      return [...prev, ...res.data]
    })
  }

  const handleRecharge = () => {
    navigate('/order/recharge')
  };

  const handleWithdrawal = () => {
    navigate('/order/withdraw')
  };

  useEffect(() => {
    if (!executed && page === 0 && list.length === 0) {
      setHasMore(true)
      setExecuted(true);
    }
  }, [activeIndex, page, executed, list])


  useEffect(() => {
    getData()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '0 0 32px 0' }} className={styles.address}>
      <NavBar title={t('wallet.myWallet')} style={{ height: '100px' }}></NavBar>

      <div className={styles.wallect}>
        <Card
          headerStyle={{
            color: '#1677ff',
          }}
          bodyClassName={styles.customBody}
          title=''
        >
          <h2>{t('wallet.accountBalance')}</h2>
          <h1>${formatAmount(user?.user?.fakeBalance || 0)}</h1>
          <Divider />
          <div className={styles.datas}>
            <div className={styles.data_item}>
              <h3>{formatAmount(user?.profit?.totalProfit || 0)}</h3>
              <p>{t('wallet.cumulativeIncome')}</p>
            </div>
            <div className={styles.data_item}>
              <h3>{formatAmount(user?.profit?.yesterdayProfit || 0)}</h3>
              <p>{t('wallet.earningsYesterday')}</p>
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
              {t('wallet.recharge')}
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
              {t('wallet.withdraw')}
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
            <Tabs.Tab title={t(item.title)} key={item.key} />
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
                  <div className={styles.item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p>{t('wallet.status')}: {msg.status}</p>
                      <p>{t('wallet.number')}: {msg.rechargeNumber ? msg.rechargeNumber : msg.withdrawalNumber}</p>
                      <p>{t('wallet.time')}: {msg.rechargeTime ? msg.rechargeTime : msg.withdrawalTime}</p>
                    </div>

                    <div className={styles.amount} style={{ color: activeIndex == '0' ? '#ff6767' : '#44a53b' }}>
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
              description={t('wallet.noData')}
            />
        }

      </div>
      <InfiniteScroll loadMore={() => loadMore(activeIndex)} hasMore={hasMore} />
    </div>
  );
}
