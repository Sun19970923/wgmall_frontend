/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-16 21:48:59
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 05:48:11
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\rechargeP2P.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react';
import { Card, Input, Button, Toast } from 'antd-mobile';
import styles from "./rechargeP2P.module.less";
import { useNavigate } from "react-router-dom";
import { rechargeRecordsUser } from '@/api/user';

export default function Recharge() {
  const [amount, setAmount] = useState('');
  const navigate = useNavigate();
  

  const handleNext = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      Toast.show({ content: '请输入有效的充值金额'  });
      return;
    }

    let userInfo = JSON.parse(localStorage.getItem('userInfo'));
    let res = await rechargeRecordsUser({
      amount: Number(amount),
      "username": userInfo.username
    })
    if(res.code === 200){
      
      Toast.show({ content: '请联系客服 并告知你想充值的金额' });
      setTimeout(() => {
          navigate('/order/meeting')
      }, 2000);
      return;
    }

    Toast.show({ content: res.message });

  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)', padding: '32px 0', boxSizing: 'border-box' }} className={styles.content}>
      <Card
        style={{
          maxWidth: 380,
          margin: '0 auto',
          borderRadius: 18,
          boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
          background: 'linear-gradient(135deg, #fff 60%, #f5f7fa 100%)',
        }}
        bodyStyle={{ padding: '36px 24px 32px 24px' }}
      >
        <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 32, color: '#232526', letterSpacing: 2 }}>
          充值
        </div>
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'block', fontSize: 16, color: '#888', marginBottom: 10, fontWeight: 500 }}>
            Recharge amount（USDT）
          </label>
          <Input
            placeholder="请输入充值金额"
            value={amount}
            onChange={val => setAmount(val.replace(/[^\d.]/g, ''))}
            clearable
            style={{
              width: 'auto',
              padding: '6px 12px',
              borderRadius: 10,
              border: '1.5px solid #bfa14a',
              background: '#f8fafc',
              color: '#232526',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(191,161,74,0.06)',
            }}
            type="number"
          />
        </div>
        <Button
          color="primary"
          size="large"
          style={{
            width: '100%',
            height: 48,
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            background: 'linear-gradient(90deg, #bfa14a 0%, #ffe082 100%)',
            color: '#232526',
            letterSpacing: 2,
            boxShadow: '0 2px 8px rgba(191,161,74,0.10)',
          }}
          onClick={handleNext}
        >
          Nextstep
        </Button>
      </Card>
    </div>
  );
} 