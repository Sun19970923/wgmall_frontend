/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-24 20:31:07
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import { List, Badge, InfiniteScroll, Empty, Ellipsis } from 'antd-mobile';
import { MessageOutline, FileOutline, QuestionCircleOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { message } from "@/api/user"
import { wishlistList, wishlistDelete } from "@/api/product"
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile';


export default function Message() {
  const [msgList, setMsgList] = useState([]);
  const [hasMore, setHasMore] = useState(true)
  const [current, setCurrent] = useState({page: 0})
  const navigate = useNavigate()


  const loadMore = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    console.log(userinfo);
    
    let res = await wishlistList(userinfo.id)

    setHasMore(false)

    setMsgList(res.data)

    // const append = await mockRequest()
    // setHasMore(append.length > 0)
  }

  const detele = async (userId, productId) => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    let res = await wishlistDelete(userinfo.id, productId)

    if(res.code == 200){
      Toast.show({
        icon: 'success',
        content: '删除成功'
      })
    }

    loadMore()
  }


  const handleRead = (item) => {
    localStorage.setItem('item', JSON.stringify(item))
    navigate('/details')
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
        <NavBar title={'心愿单'} style={{ height: '100px' }}></NavBar>
        {
          msgList.length > 0 ?
          <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
            {msgList.map(msg => (
              <List.Item
                key={msg.id}
                description={<span style={{ color: '#666', fontSize: 14 }}>{msg.content}</span>}
                extra={<span style={{ color: '#aaa', fontSize: 13 }}>{msg.time}</span>}
                onClick={() => handleRead(msg.product)}
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
                    <img src={baseApi + msg.product.imagePath} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                  </div>

                  <div style={{ width: '58%', padding: '10px 0' }}>
                    {
                      msg.product?.price &&
                      <Ellipsis direction='end' content={msg.product?.name} rows={2} style={{ fontSize: '18px'}}/>
                    }
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <p style={{ color: '#fb7701',fontSize: '18px' }}>$ {msg.product?.price}</p>
                      <button onClick={(e) => {
                        e.stopPropagation(); // 阻止事件冒泡
                        detele(msg.user.id, msg.product.id)
                      }} style={{ color: '#fff', background: '#fb7701' , padding: '4px 8px' , border: 'none', fontSize: '14px', borderRadius: '8px' }}>删除</button>
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
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
} 