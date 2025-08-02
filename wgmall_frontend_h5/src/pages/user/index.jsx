import React, { useState } from 'react';
import { List, Badge, Card } from 'antd-mobile';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";


const messages = [
  {
    id: 1,
    title: '系统通知',
    content: '欢迎加入平台，祝您体验愉快！',
    time: '2024-07-15 10:20',
    unread: true,
    icon: <MessageOutline style={{ color: '#4a90e2', fontSize: 24 }} />,
  },
  {
    id: 2,
    title: '订单消息',
    content: '您的订单已发货，请注意查收。',
    time: '2024-07-14 18:05',
    unread: false,
    icon: <FileOutline style={{ color: '#4a90e2', fontSize: 24 }} />,
  },
  {
    id: 3,
    title: '活动消息',
    content: '夏日大促即将开启，快来参与吧！',
    time: '2024-07-13 09:30',
    unread: true,
    icon: <GiftOutline style={{ color: '#4a90e2', fontSize: 24 }} />,
  },
];

export default function Message() {
  const [msgList, setMsgList] = useState(messages);

  const handleRead = (id) => {
    setMsgList(list => list.map(msg => msg.id === id ? { ...msg, unread: false } : msg));
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
        <NavBar title={'站内信'} style={{ height: '100px' }}></NavBar>
        <div style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, marginBottom: 18, color: '#223', letterSpacing: 1, lineHeight: '100px' }}>
            站内信
        </div>
        <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
            {msgList.map(msg => (
            <List.Item
                key={msg.id}
                prefix={msg.icon}
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
    </div>
  );
} 