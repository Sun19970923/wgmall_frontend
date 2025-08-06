import React, { useState } from 'react'
import { Mask, Space } from 'antd-mobile'
import { Button } from 'antd'
import styles from './MatcingSubmit.module.less'
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";


// 基础用法
const Simple = ({ parentValue, onValueChange, isClose, data, onSubmit, user }) => {
  const navigate = useNavigate();


  useEffect(() => {
    console.log(data, 111);
  }, [])

  return (
    <>
      <Mask visible={parentValue} onMaskClick={() => {
        if (!isClose) return
        onValueChange(!parentValue)
      }}>
        <div className={styles.mask}>
          {
            data.status &&
            <div className={styles.listItem}>
              <h4>Order number：Temu {data?.productId}</h4>
              <img className={styles.state} src={data?.status === 'pending' ? require('@/assets/order_list_pending.png') : require('@/assets/order_list_success.png')} alt="" />

              <div className={styles.product}>
                <img src={baseApi + data.firstImagePath} alt="" />
                <div>
                  <h2>{data.productName}</h2>
                  <h2>Price：{data.productAmount}</h2>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
                <p style={{ margin: 0, color: "#000", fontSize: 10,fontWeight: 1000 }}>
                  Amount ${data.productAmount}
                </p>
                <p style={{ margin: 0, color: "#1f8f1f", fontSize: 10,fontWeight: 1000 }}>
                  Profit +${data.commission}
                </p>
                <p style={{ margin: 0, color: "#1f8f1f", fontSize: 14, fontWeight: 1000 }}>
                  Total: ${data.expectReturn}
                </p>
              </div>
            </div>
          }
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit" className={styles.submit} onClick={() => onSubmit(data.taskId)}>
              Submit 
            </Button>
            {
              user.fakeBalance <= 0 &&
              <Button type="primary" htmlType="submit" className={styles.submit} onClick={() => navigate('/order/recharge')}>
                Add Funds
              </Button>
            }
          </div>
        </div>
      </Mask>
    </>
  )
}


export default Simple;