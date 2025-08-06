/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-30 00:18:38
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-07 02:04:10
 * @FilePath: \新建文件夹\新建文件夹\ChatPage.jsx
 * @Description: 聊天页面组件
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  NavBar,
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
import { useTranslation } from 'react-i18next';

let ws = null

let { id } = JSON.parse(localStorage.getItem('userInfo'))
export default function ChatPage() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 同步更新数据
  const requireChat = (user) => {
    setLoading(true)
    ws = new SimpleWebSocket('wss://api.xxzh.cc/ws/chat?userId='+id)
    ws.connect();

    ws.onMessage(msg => {
      if(msg?.type === 'ping') {
        ws.send({
          "type": 'ping'
        });
        return
      }

      if(msg.data?.length > 0){
        setLoading(false)
        setChatMessages(msg.data)

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    });

    ws.onOpen(() => {
      ws.send(JSON.stringify({
        action: "history",
        senderId: id,
        receiverId: user.userId,
      })
      );
    })
  }

  // 获取用户
  const wsFn = (ws, id) => {
    ws.connect();
    ws.onOpen(() => {
      ws.send({
        "action": "conversations",
        "senderId": id,
      });
    });

    // 监听消息
    ws.onMessage(msg => {
      console.log(t('shopmeeting.receivedMessageLog'), msg);
      if(msg?.type === 'ping') {
        ws.send({
          "type": 'ping'
        });
        return
      }

      if(msg.type == 'conversations' && msg.data){
        setLoading(false)
        setUsers(res.data)
      }
      if(msg.data){
        setUsers(msg.data)
        setLoading(false);
      }
    });
  }

  const setHistory = (data) => {
    setChatMessages(data)
  }

  const fetchChatHistory = async () => {
    setLoading(true);
    const ws = new SimpleWebSocket('wss://api.xxzh.cc/ws/chat?userId='+id)
    wsFn(ws, id)
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    fetchChatHistory()
  }, [])

  // 发送消息
  const sendMessage = async () => {
    if (!inputValue.trim() || !selectedUser) return;

    const newMessage = {
      "id": inputValue.trim(),
      "senderId": Number(id),
      "receiverId": selectedUser.userId,
      "content": inputValue.trim(),
      "read": false,
      "createTime": 'now'
    }

    console.log(newMessage, 'newMessage');

    setChatMessages(prev => [...prev, newMessage]);
    setInputValue('');

    console.log(ws, 'ws');

    ws.send({
      action: "send",
      senderId: id,
      receiverId: selectedUser.userId,
      message: {
        senderId: id,
        receiverId: selectedUser.userId,
        content: inputValue.trim()
      }
    });

    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // 选择用户
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    requireChat(user)
  };

  useEffect(() => {
    return () => ws.close()
  }, [])

  return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <NavBar backArrow={false}>{t('shopmeeting.chat')}</NavBar>

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* 左侧用户列表 */}
          <div style={{ width: '35%', borderRight: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflow: 'auto' }}>
              {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                    <SpinLoading />
                  </div>
              ) : (
                  <List>
                    {users.map(user => (
                        <List.Item
                            key={user.userId}
                            prefix={
                              <Avatar
                                  src={require('@/assets/head.jpg')}
                                  style={{ '--size': '40px' }}
                              >
                                <UserOutline />
                              </Avatar>
                            }
                            description={
                              <div>
                                <div style={{ fontSize: '12px', color: '#999' }}>{user.lastMessage}</div>
                                <div style={{ fontSize: '10px', color: '#ccc' }}>{user.lastTime}</div>
                              </div>
                            }
                            onClick={() => handleUserSelect(user)}
                            style={{
                              backgroundColor: selectedUser?.id === user.id ? '#f5f5f5' : 'transparent',
                              cursor: 'pointer'
                            }}
                        >
                          <span style={{ fontSize: '16px' }}>{user.username}</span>
                        </List.Item>
                    ))}
                  </List>
              )}
            </div>
          </div>

          {/* 右侧聊天区域 */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {selectedUser ? (
                <>
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
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{selectedUser.username}</span>
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
                                    justifyContent: message.senderId == id ? 'flex-end' : 'flex-start',
                                    marginBottom: '12px'
                                  }}
                              >
                                <div
                                    style={{
                                      maxWidth: '70%',
                                      padding: '8px 12px',
                                      borderRadius: '12px',
                                      backgroundColor: message.senderId == id ? '#007AFF' : '#fff',
                                      color: message.senderId == id ? '#fff' : '#333',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                    }}
                                >
                                  <div>{message.content}</div>
                                  <div style={{
                                    fontSize: '10px',
                                    color: message.senderId == id ? 'rgba(255,255,255,0.7)' : '#999',
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
                        placeholder={t('shopmeeting.inputPlaceholder')}
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
                      {t('shopmeeting.send')}
                    </Button>
                  </div>
                </>
            ) : (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontSize: '16px'
                }}>
                  {t('shopmeeting.selectUser')}
                </div>
            )}
          </div>
        </div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />

        <ShopTabBar></ShopTabBar>
      </div>
  );
}