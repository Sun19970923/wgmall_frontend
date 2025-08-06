import React, { useState, useEffect } from 'react';
import { Tabs, List, InfiniteScroll, Toast, Segmented, PullToRefresh, Empty } from 'antd-mobile';
import styles from './list.module.less';
import CusttomTabBar from "../../components/CuttomTabber";
import { pendingList, historyList, complete } from '@/api/matic';
import { useMemo } from 'react';
import MaskSubmit from '../../components/MatcingSubmit';
import { formatAmount } from '@/utils/utils';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

const PAGE_SIZE = 10;

export default function App() {
  const { t } = useTranslation(); // 使用 t 函数
  const [tab, setTab] = useState('pending');
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({}); // data
  const [value, setValue] = useState(0); // 状态提升到父组件
  const [data, setData] = useState({}); // 状态提升到父组件
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  // 加载订单数据
  const loadOrders = async (reset = false, tab = 'pending') => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'));
    setUser(userinfo);

    setLoading(true);
    let res = tab === 'pending' ? await pendingList({ userId: userinfo.id }) : await historyList({ userId: userinfo.id, page });

    let filtered = null;
    if (tab === 'pending') {
      filtered = res.data;
    } else {
      filtered = res.data.content;
    }

    if (reset) {
      setList(filtered);
      setPage(0);
      setHasMore(filtered.length);
      return;
    } else {
      setList((prev) => [...prev, ...filtered]);
      setPage((prev) => {
        if (prev + 1 >= totalPages) {
          setHasMore(false);
          setLoading(true);
        }
      });
    }

    setLoading(false);
  };

  const submit = async (taskId) => {
    setLoading(true);
    let res = await complete({ taskId });
    setLoading(false);
    if (res.code === 200) {
      Toast.show({
        icon: 'success',
        content: res.message,
      });

      setValue(false);
      setData({});
      loadOrders(true);
      getData();
    }

    if (res.code === 402) {
      navigate('/order/recharge');
    }
  };

  // 上拉加载
  const loadMore = async () => {
    if (loading) return;
    await loadOrders(false, tab);
    if (!hasMore) {
      Toast.show({ content: t('taskpending.noMore'), position: 'bottom' });
    }
  };

  const getData = async () => {
    // let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    // let infoData = await info({ userId: userinfo.id })
    // localStorage.setItem("userInfo", JSON.stringify(infoData.data?.user))
    // setUser(infoData.data || {});
  };

  const clickProduct = (data) => {
    if (tab !== 'pending') {
      return;
    }

    setData({ ...data, status: tab });
    setValue(true);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div style={{ minHeight: '100vh' }} className={styles.listData}>
      {
        data.status &&
        <MaskSubmit parentValue={value} onValueChange={setValue} isClose={true} user={user} data={data} onSubmit={(taskId) => submit(taskId)} />
      }
      <PullToRefresh
        onRefresh={() => {
          setList([]);
          setPage(0);
          getData();
          setHasMore(true);
        }}
      >
        <h2>{t('taskpending.accountBalance')}</h2>
        <h1 style={{ fontSize: 32 }}>${formatAmount(user?.fakeBalance || 0)}</h1>
        <Segmented
          block
          options={[t('taskpending.pending'), t('taskpending.completed')]}
          onChange={(value) => {
            setTab(value === t('taskpending.pending') ? 'pending' : 'completed');
            setList([]);
            loadOrders(false, value === t('taskpending.pending') ? 'pending' : 'completed');
          }}
        />
        {list.length > 0 ? (
          <List style={{ margin: '12px 0' }}>
            {list.map((item, index) => (
              <List.Item
                key={index}
                className={styles.listItem}
                onClick={() => clickProduct(item)}
              >
                <h4>{item.time}</h4>
                <h4>{item.num}</h4>
                <img
                  className={styles.state}
                  src={
                    item.status === 'pending'
                      ? require('@/assets/order_list_pending.png')
                      : require('@/assets/order_list_success.png')
                  }
                  alt=""
                />

                <div className={styles.product}>
                  <img src={baseApi + item.firstImagePath} alt="" />
                  <div>
                    <h2>{item.productName}</h2>
                    <h2>
                      {t('taskpending.price')}: ${formatAmount(item.productAmount)}
                    </h2>
                  </div>
                </div>

                {/* 这里是改造后的 info 三项，内联样式 */}
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    flexWrap: 'wrap',
                    marginTop: 8,
                  }}
                >
                  {/* 订单金额 */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      lineHeight: 1.2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#666',
                        marginBottom: 4,
                      }}
                    >
                      {t('taskpending.orderAmount')}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#1f1f1f',
                      }}
                    >
                      ${formatAmount(item.productAmount)}
                    </div>
                  </div>

                  {/* 佣金 */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      lineHeight: 1.2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#666',
                        marginBottom: 4,
                      }}
                    >
                      {t('taskpending.commission')}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: '#16a34a'
                      }}
                    >
                      {Number(item.commission) >= 0
                        ? `+${formatAmount(item.commission)}`
                        : formatAmount(item.commission)}
                    </div>
                  </div>

                  {/* 预计返报 */}
                  {/* 预计返报 */}
                  <div
                    style={{
                      flex: 1,
                      minWidth: 100,
                      display: 'flex',
                      flexDirection: 'column',
                      lineHeight: 1.2,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: '#666',
                        marginBottom: 4,
                      }}
                    >
                      {t('taskpending.expectedReturn')}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#16a34a',
                      }}
                    >
                      ${formatAmount(item.expectReturn)}
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
            description={t('taskpending.noData')}
          />
        )}

        <br />
        <br />
        <br />
        <br />
        <InfiniteScroll loadMore={() => loadMore()} hasMore={hasMore} />
      </PullToRefresh>

      <CusttomTabBar />
    </div>
  );
} 
