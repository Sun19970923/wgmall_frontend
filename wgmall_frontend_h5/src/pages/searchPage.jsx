/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 06:18:43
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react'
import { List, Badge, InfiniteScroll, Empty, SearchBar } from 'antd-mobile'
import { MessageOutline, FileOutline, QuestionCircleOutline } from 'antd-mobile-icons'
import NavBar from '../components/NavBar'
import { search } from '@/api/product'
import styles from '@/assets/css/searchPage.less'
import { useNavigate } from "react-router-dom";






export default function Message() {
  const [msgList, setMsgList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [val, setVal] = useState('')
  const [current, setCurrent] = useState({ page: 0 })
  const navigate = useNavigate();


  const loadMore = async () => {
    console.log(val, '131313131');
    
    if(!val){
        setHasMore(false)
        return
    }

    let res = await search({ keyword: val, page: current.page, size: 10 })
    setCurrent((prev) => ({ page: prev.page + 1 }))

    console.log(res.data, '111')

    if (res.data.length == 0) {
      return setHasMore(false)
    }

    console.log(res)

    setMsgList((prev) => {
      if ([...prev, ...res.data].length >= res.data.total) {
        setHasMore(false)
      }
      return [...prev, ...res.data]
    })

    // const append = await mockRequest()
    // setHasMore(append.length > 0)
  }

  const getData = (aaa) => {
    setVal(aaa)
    setHasMore(true)
  }

  const handleRead = (id) => {
    setMsgList((list) => list.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg)))
  }

  return (
    <div className={styles.content} style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
      <NavBar title={'搜索'} style={{ height: '100px' }}></NavBar>

      <SearchBar
        onSearch={(val) => {
          getData(val)
        }}
        style={{ '--height': '50px', fontSize: '32px' }}
        placeholder="请输入内容"
      />

      {msgList.length > 0 ? (
        <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
          {msgList.map((msg, i) => (
            <List.Item
              key={i}
              description={<span style={{ color: '#666', fontSize: 14 }}>{msg.content}</span>}
              extra={<span style={{ color: '#aaa', fontSize: 13 }}>{msg.time}</span>}
              onClick={() => {
                localStorage.setItem('item', JSON.stringify(msg))
                navigate('/details')
              }}
              style={{
                fontWeight: msg.unread ? 700 : 400,
                background: msg.unread ? 'linear-gradient(90deg, #f5f7fa 0%, #fff 100%)' : '#fff',
                borderRadius: 8,
                margin: '8px 16px',
                boxShadow: msg.unread ? '0 2px 8px rgba(60,80,120,0.06)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start',  }}> 
                <img style={{ width: '100px', height: '100px', marginRight: '20px' }} src={baseApi + msg.imagePath} alt="" />
                <span style={{ fontSize: 16, fontWeight: 700, width: 200 }}>
                    <span>{msg.name}</span>
                    <div>
                        $ {msg.price}
                    </div>
                </span>
              </div>
              
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
