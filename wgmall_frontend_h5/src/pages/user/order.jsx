/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-26 02:02:34
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PullToRefresh, Button, Toast, Card, Space, TabBar, Tag, Grid, InfiniteScroll, List, Tabs, Empty, Ellipsis } from "antd-mobile";
import styles from "@/assets/css/order.less";
import { formatAmount } from '@/utils/utils'
import { info } from '@/api/user';
import { useEffect, useState } from "react";
import { orderAll, pendingAll, refundingAll, processingAll, deliveredAll } from '@/api/product';
import NavBar from "../../components/NavBar";

const getApiUrl = (type) => {
  const apiUrls = {
    0: orderAll,
    1: pendingAll,
    2: processingAll,
    3: deliveredAll,
    4: refundingAll,
  };


  return apiUrls[type] || null; // 如果 type 不在范围内，返回 null
};



const OrderList = () => {
  const [user, setUser] = useState({}); // data
  const [activeIndex, setActiveIndex] = useState(0)
  const [list, setList] = useState([]); // data
  const [page, setPage] = useState(0); // data
  const [hasMore, setHasMore] = useState(true)


  

  const loadMore = async () => {

    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    console.log(activeIndex, 'activeIndex');
    let api = getApiUrl(activeIndex)

    console.log(api, 'api');
    
    

    let orderData = await api({ buyerName: userinfo.username, page })

    console.log(orderData, 'orderData');
    
    if(orderData.data.content.length == 0){
        return setHasMore(false)
    }

    console.log(orderData, 111);
    
    setList(prev => {
        if([...prev, ...orderData.data.content].length >= orderData.data.totalElements){
            setHasMore(false)
        }
        setPage(page + 1)
        return [...prev, ...orderData.data.content]
    })
  }


  const tabItems = [
    { key: '0', title: '全部' },
    { key: '1', title: '待发货' },
    { key: '2', title: '待收货' },
    { key: '3', title: '已送达' },
    { key: '4', title: '退款中' },
  ]

  const getUser = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    
    let infoData = await info({ userId: userinfo.id })

    setUser(infoData.data)
  }

  const getType = async (key) => {
      setList([])
      setPage(0)
      setHasMore(true)
  }

  useEffect(() => {
    getUser()
  }, [])



  return (
    <div className={styles.indexContainer}>
      <div className={styles.indexBody}>
        <NavBar title={'我的订单'}></NavBar>
        <PullToRefresh
          onRefresh={() => {
            console.log("PullToRefresh");
          }}
        >
            <Tabs
              activeKey={tabItems[activeIndex].key}
              style={{ '--title-font-size': '18px', '--content-padding': '18px', '--active-line-color': '#333', '--active-title-color': '#333' }}
              onChange={key => {
                const index = tabItems.findIndex(item => item.key === key)
                getType(key)
                setActiveIndex(index)
              }}
            >
              {tabItems.map(item => (
                <Tabs.Tab title={item.title} key={item.key} />
              ))}
            </Tabs>


            {
                list.length > 0 ?
                <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                    {list.map((msg, i) => (
                    <List.Item
                        key={i}
                        description={<span style={{ color: '#666', fontSize: 20 }}>{msg.content}</span>}
                        extra={<span style={{ color: '#aaa', fontSize: 18 }}>{msg.time}</span>}
                        onClick={() => handleRead(msg.id)}
                        style={{
                            fontWeight: msg.unread ? 700 : 400,
                            background: msg.unread ? 'linear-gradient(90deg, #f5f7fa 0%, #fff 100%)' : '#fff',
                            borderRadius: 8,
                            margin: '8px 16px',
                            boxShadow: msg.unread ? '0 2px 8px rgba(60,80,120,0.06)' : 'none',
                        }}
                    >

                        <div className={styles.item}>
                            <div>
                                <img src={baseApi + msg.product.imagePath} alt="" />
                            </div>


                            <div className={styles.itemRight}>
                                <Ellipsis direction='end' rows={2} content={msg.product.name} />
                                <div>
                                    <p>Order Num: {msg.orderNumber}</p>
                                    <p>Time: {msg.createdAt}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <span>Total Amount: {msg.totalAmount}</span>
                                        <Tag color='warning' style={{ fontSize: '12px' }}>{msg.status}</Tag>
                                    </div>
                                </div>
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

        </PullToRefresh>
      </div>

      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
};


export default OrderList;
