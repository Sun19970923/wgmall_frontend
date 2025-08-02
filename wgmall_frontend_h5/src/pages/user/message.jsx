/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-31 03:22:25
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import { List, Badge, InfiniteScroll, Empty } from 'antd-mobile';
import { MessageOutline, FileOutline, QuestionCircleOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { message } from "@/api/user"




export default function Message() {
  const [msgList, setMsgList] = useState([]);
  const [hasMore, setHasMore] = useState(true)
  const [current, setCurrent] = useState({page: 0})
  
  const loadMore = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    let res = await message({ receiverId: userinfo.id, page: current.page, size: 10 })
    setCurrent(prev => ({ page: prev.page + 1}))

    console.log(res.data, '111');
    

    if(res.data.length == 0){
      return setHasMore(false)
    }

    console.log(res);
    
    setMsgList(prev => {
      if([...prev, ...res.data.messages].length >= res.data.total){
        setHasMore(false)
      }
      return [...prev, ...res.data.messages]
    })

    // const append = await mockRequest()
    // setHasMore(append.length > 0)
  }


  const handleRead = (id) => {
    setMsgList(list => list.map(msg => msg.id === id ? { ...msg, unread: false } : msg));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
        <NavBar title={'个人中心'} style={{ height: '100px' }}></NavBar>
        {
          msgList.length > 0 ?
          <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
            {msgList.map(msg => (
              <List.Item
                key={msg.id}
                description={<span style={{ color: '#666', fontSize: 14 }}>{msg.content}</span>}
                extra={<span style={{ color: '#aaa', fontSize: 13 }}>{msg.time}</span>}
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
                  {msg.title}
                  {msg.unread && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#4a90e2', marginLeft: 8 }} />}
                </span>
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
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
} 