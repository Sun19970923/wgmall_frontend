import React, { useState, useEffect, useRef } from 'react';
import { List, Input, Button, Card, Toast } from 'antd-mobile';

export default function Chat({ role = 'buyer', wsUrl = 'ws://' + baseApi }) {
  const [messages, setMessages] = useState([]); // {from, content, time}
  const [input, setInput] = useState('');
  const ws = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    ws.current = new window.WebSocket(wsUrl);
    ws.current.onopen = () => {
      Toast.show({ icon: 'success', content: '已连接服务器' });
    };
    ws.current.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        setMessages((prev) => [...prev, msg]);
      } catch {
        // ignore
      }
    };
    ws.current.onerror = () => {
      Toast.show({ icon: 'fail', content: 'WebSocket 连接失败' });
    };
    ws.current.onclose = () => {
      Toast.show({ icon: 'fail', content: 'WebSocket 已断开' });
    };
    return () => {
      ws.current && ws.current.close();
    };
  }, [wsUrl]);

  useEffect(() => {
    // 滚动到底部
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMsg = () => {
    if (!input.trim()) return;
    const msg = {
      from: role,
      content: input,
      time: new Date().toLocaleTimeString(),
    };
    ws.current.send(JSON.stringify(msg));
    setMessages((prev) => [...prev, msg]);
    setInput('');
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
      <Card
        style={{
          maxWidth: 480,
          margin: '32px auto 0',
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(60,80,120,0.08)',
          background: '#fff',
        }}
        bodyStyle={{ padding: '18px 0 8px 0' }}
      >
        <div style={{ textAlign: 'center', fontSize: 21, fontWeight: 700, marginBottom: 18, color: '#223', letterSpacing: 1 }}>
          卖家/买家聊天
        </div>
        <div ref={listRef} style={{ maxHeight: 400, overflowY: 'auto', padding: '0 12px 8px 12px', background: '#f7f9fa', borderRadius: 8 }}>
          <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
            {messages.map((msg, idx) => (
              <List.Item
                key={idx}
                style={{
                  justifyContent: msg.from === role ? 'flex-end' : 'flex-start',
                  display: 'flex',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
              >
                <div
                  style={{
                    maxWidth: '70%',
                    marginLeft: msg.from === role ? 'auto' : 0,
                    marginRight: msg.from === role ? 0 : 'auto',
                    background: msg.from === role ? '#4a90e2' : '#fff',
                    color: msg.from === role ? '#fff' : '#333',
                    borderRadius: 12,
                    padding: '8px 14px',
                    fontSize: 15,
                    boxShadow: '0 2px 8px rgba(60,80,120,0.06)',
                    marginBottom: 8,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>
                    {msg.from === 'buyer' ? '买家' : '卖家'}
                  </div>
                  <div>{msg.content}</div>
                  <div style={{ fontSize: 11, color: '#bbb', textAlign: 'right', marginTop: 2 }}>{msg.time}</div>
                </div>
              </List.Item>
            ))}
          </List>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12, padding: '0 12px' }}>
          <Input
            placeholder="请输入消息"
            value={input}
            onChange={setInput}
            onEnterPress={sendMsg}
            clearable
            style={{ flex: 1, marginRight: 8 }}
          />
          <Button color="primary" onClick={sendMsg} disabled={!input.trim()}>
            发送
          </Button>
        </div>
      </Card>
    </div>
  );
}
