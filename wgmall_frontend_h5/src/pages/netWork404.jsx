/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-30 00:18:38
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 01:39:55
 * @FilePath: \新建文件夹\新建文件夹\NetworkErrorPage.jsx
 * @Description: 网络错误空白页面组件
 */
import React from 'react';
import { Button, Toast } from 'antd-mobile';

export default function NetworkErrorPage({ onRetry }) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      // 默认重试逻辑
      Toast.show('正在重试...');
      // 这里可以添加重试逻辑，比如重新加载页面或重新请求数据
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      {/* 错误图标 */}
      <div style={{
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <img style={{ width: '100%' }} src={require('@/assets/head.jpg')} alt="" />
      </div>

      {/* 错误标题 */}
      <h2 style={{
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        margin: '0 0 12px 0',
        textAlign: 'center'
      }}>
        网络连接失败
      </h2>

      {/* 错误描述 */}
      <p style={{
        fontSize: '14px',
        color: '#666',
        margin: '0 0 32px 0',
        textAlign: 'center',
        lineHeight: '1.5',
        maxWidth: '280px'
      }}>
        请检查您的网络连接是否正常，或稍后再试
      </p>


      {/* 可选的其他操作 */}
      <div style={{
        marginTop: '24px',
        display: 'flex',
        gap: '16px'
      }}>
        <Button
          fill="none"
          size="small"
          onClick={() => {
            // 可以添加其他操作，比如返回上一页
            if (window.history.length > 1) {
              window.history.back();
            }
          }}
          style={{
            color: '#666',
            fontSize: '14px'
          }}
        >
          返回上页
        </Button>
        <Button
          fill="none"
          size="small"
          onClick={() => {
            // 可以添加其他操作，比如跳转到首页
            window.location.href = '/';
          }}
          style={{
            color: '#666',
            fontSize: '14px'
          }}
        >
          回到首页
        </Button>
      </div>
    </div>
  );
}