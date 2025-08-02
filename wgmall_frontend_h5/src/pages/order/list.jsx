/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-14 15:42:24
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-02 00:27:25
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\order.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react';
import { Tabs, List, InfiniteScroll, Toast, Segmented, PullToRefresh, Empty } from 'antd-mobile';
import styles from './list.module.less'
import CusttomTabBar from "../../components/CuttomTabber";
import { pendingList, historyList, complete } from '@/api/matic';
import { useMemo } from 'react';
import MaskSubmit from '../../components/MatcingSubmit'
import { formatAmount } from '@/utils/utils'
import { useNavigate } from "react-router-dom";



const PAGE_SIZE = 10;

export default function App() {
  const [tab, setTab] = useState('pending');
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({}); // data
  const [value, setValue] = useState(0); // 状态提升到父组件
  const [data, setData] = useState({}); // 状态提升到父组件
  const [totalPages, setTotalPages] = useState(0)
  const navigate = useNavigate();

  

  // 加载订单数据
  const loadOrders = async (reset = false, tab = 'pending') => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    setUser(userinfo)

    setLoading(true); 
    // 模拟异步请求
    let res = tab == 'pending' ? await pendingList({ userId: userinfo.id }) : await historyList({ userId: userinfo.id, page })
    console.log(res);
    let filtered = null

    if(tab == 'pending'){
      filtered = res.data
    }else{
      filtered = res.data.content
    }
    
    if (reset) {
      setList(filtered);
      setPage(0);
      setHasMore(filtered.length);
      return
    } else {
      setList((prev) => [...prev, ...filtered]);
      setPage((prev) => {
        if(prev + 1 >= totalPages){
          setHasMore(false)
          setLoading(true);
        }
      });
    }

    setLoading(false);
  };

  const submit = async (taskId) => {
    setLoading(true); 
    let res = await complete({ taskId })
    setLoading(false); 
    console.log(res, 'res res');
    if(res.code == 200){
      Toast.show({
        icon: 'success',
        content: res.message,
      })

      setValue(false)
      setData({})
      loadOrders(true);
      getData()
    }

    if(res.code == 402){
      navigate('/order/recharge')
    }
  }



  // 上拉加载
  const loadMore = async () => {
    if (loading) return;
    await loadOrders(false, tab);
    if (!hasMore) {
      Toast.show({ content: '没有更多了', position: 'bottom' });
    }
  };


  const getData = async () => {
    // let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    // let infoData = await info({ userId: userinfo.id })

    // console.log(infoData.data?.user, 'infoData infoData');
    

    // localStorage.setItem("userInfo", JSON.stringify(infoData.data?.user))

    // setUser(infoData.data || {})
  }



  const clickProduct = (data) => {
    console.log(data, '13131');

    if(tab !== 'pending'){
      return
    }
    
    setData({ ...data, status: tab })
    setValue(true)
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <div style={{ minHeight: '100vh' }} className={styles.listData}>
        {
          data.status && 
          <MaskSubmit parentValue={value} onValueChange={setValue}  isClose={true}  user={user}  data={data} onSubmit={(taskId) => submit(taskId)}></MaskSubmit>
        }
        <PullToRefresh
          onRefresh={() => {
            setList([])
            setPage(0)
            getData()
            setHasMore(true)
          }}
        >
            <h2>Account balance</h2>
            <h1 style={{ fontSize: 32 }}>${ formatAmount(user?.fakeBalance || 0) }</h1>
            <Segmented block options={['Pending', 'Complated']} onChange={(value) => {
              setTab(value === 'Pending' ? 'pending' : 'completed')
              setList([])
              loadOrders(false, value === 'Pending' ? 'pending' : 'completed')
            }}/>
              {
                list.length > 0 ?
                  <List style={{ margin: '12px 0' }}>
                      {list.map((item, index) => (
                          <List.Item key={index} className={styles.listItem} onClick={() => clickProduct(item)}>
                              <h4>{item.time}</h4>
                              <h4>{item.num}</h4>
                              <img className={styles.state} src={item.status === 'pending' ? require('@/assets/order_list_pending.png') : require('@/assets/order_list_success.png')} alt="" />

                              <div className={styles.product}>
                                  <img src={baseApi + item.firstImagePath} alt="" />
                                  <div>
                                      <h2>{item.productName}</h2>
                                      <h2>Price：${formatAmount(item.productAmount)}</h2>
                                  </div>
                              </div>

                              <div className={styles.info}>
                                  <p>order amount: {item.productAmount}</p>
                                  <p>Commission: {item.expectReturn}</p>
                                  <p>Expected return USDT: {item.commission}</p>
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
              <br />
              <br />
              <br />
              <br />
            <InfiniteScroll loadMore={() => loadMore()} hasMore={hasMore} />
        </PullToRefresh>

        <CusttomTabBar></CusttomTabBar>
    </div>
  );
} 