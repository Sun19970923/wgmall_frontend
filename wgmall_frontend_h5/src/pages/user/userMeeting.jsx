/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-30 00:18:38
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-07 02:04:48
 * @FilePath: \新建文件夹\新建文件夹\ChatPage.jsx
 * @Description: 聊天页面组件
 */
import React, { useState, useEffect, useRef } from 'react';
import { 
  List, 
  Input, 
  Button, 
  Avatar, 
  Divider,
  Toast,
  SpinLoading
} from 'antd-mobile';
import { SendOutline, UserOutline } from 'antd-mobile-icons';
import ShopTabBar from '../../components/ShopTabBar'
import { SimpleWebSocket } from '@/utils/utils';
import NavBar from '../../components/NavBar'
import { useLocation } from 'umi'



let u = JSON.parse(localStorage.getItem('userInfo'))

const ws = new SimpleWebSocket('wss://api.xxzh.cc/ws/chat?userId='+u.id)
ws.connect();

ws.onMessage(msg => {
  console.log('收到消息：', msg);
  if(msg?.type === 'ping'){
    ws.send({
      type: 'ping'
    });
  }
});


export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  let userId = queryParams.get('userId') || ''
  let shopId = queryParams.get('shopId') || ''




  // 同步更新数据
  const requireChat = () => {
    setLoading(true)
    const ws = new SimpleWebSocket('wss://api.xxzh.cc/ws/chat?userId='+userId)
    ws.connect();

    ws.onMessage(msg => {
      if(msg?.type == 'ping') return
      
      console.log('收到消息：', msg);
      if(msg.data?.length > 0){
        setChatMessages(msg.data)

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      setLoading(false)
    });


    ws.onOpen(() => {
      ws.send({
        action: "history",
        senderId: userId,
        receiverId: shopId,
      });
    })

  }



  useEffect(() => {
    let user = JSON.parse(localStorage.getItem('userInfo'))
    let item = JSON.parse(localStorage.getItem('item'))
    setSelectedUser(item)
    requireChat()
  }, [])


  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedUser) return;

    const newMessage = {
      "id": inputValue.trim(),
      "senderId": Number(userId),
      "receiverId": shopId,
      "content": inputValue.trim(),
      "read": false,
      "createTime": 'now'
    }

    console.log(newMessage, 'newMessage');
  

    setChatMessages(prev => [...prev, newMessage]);
    setInputValue('');

    ws.send({
      action: "send",
      senderId: userId,  // 当前登录用户ID
      receiverId: shopId, // 目标用户ID
      message: {
        senderId: userId,
        receiverId: shopId,
        content: inputValue.trim()
      }
    });


    // 滚动到底部
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };


  
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar title={'客服'} style={{ height: '100px' }}></NavBar>
      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* 右侧聊天区域 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* 聊天头部 */}
            <div style={{ 
              padding: '12px', 
              borderBottom: '1px solid #f0f0f0', 
              display: 'flex', 
              alignItems: 'center',
              backgroundColor: '#fff'
            }}>
              <Avatar
                src={require('@/assets/head.jpg')}
                style={{ '--size': '32px', marginRight: '8px' }}
              >
                <UserOutline />
              </Avatar>
              <span style={{ fontWeight: 'bold', fontSize: 14 }}>{selectedUser.uploader}</span>
            </div>

            {/* 聊天消息区域 */}
            <div style={{ 
              flex: 1, 
              overflow: 'auto', 
              padding: '12px',
              backgroundColor: '#f5f5f5'
            }}>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                  <SpinLoading />
                </div>
              ) : (
                <div>
                  {chatMessages.map(message => (
                    <div
                      key={message.id}
                      style={{
                        display: 'flex',
                        justifyContent: message.senderId == userId ? 'flex-end' : 'flex-start',
                        marginBottom: '12px'
                      }}
                    >
                      <div
                        style={{
                          padding: '8px 12px',
                          borderRadius: '12px',
                          backgroundColor: message.senderId == userId ? '#007AFF' : '#fff',
                          color: message.senderId == userId ? '#fff' : '#333',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}
                      >
                        <div style={{ fontSize: '14px' }}>{message.content}</div>
                        <div style={{ 
                          fontSize: '10px', 
                          color: message.senderId == userId ? 'rgba(255,255,255,0.7)' : '#999',
                          marginTop: '4px'
                        }}>
                          {message.createTime}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* 输入框区域 */}
            <div style={{ 
              padding: '16px', 
              borderTop: '1px solid #f0f0f0',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px'
            }}>
              <Input
                placeholder="输入消息..."
                value={inputValue}
                onChange={setInputValue}
                onEnterPress={sendMessage}
                style={{ flex: 1, '--font-size': 32 }}
              />
              <Button
                size="small"
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                type='primary'
                style={{ fontSize: 14, color: '#fff', padding: '2px 12px' ,backgroundColor: '#FB7701' }}
              >
                发送
              </Button>
            </div>
        </div>
      </div>

      <br />
    </div>
  );
}