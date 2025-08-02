/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-15 15:52:34
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-02 00:09:08
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\components\MatcingSubmit.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
        if(!isClose) return
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

                <div className={styles.info}>
                    <p>order amount: {data.productAmount}</p>
                    <p>Commission: {data.expectReturn}</p>
                    <p>Expected return USDT: {data.commission}</p>
                </div>
            </div>
          }
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit" className={styles.submit} onClick={() => onSubmit(data.taskId)}>
              Submit Now
            </Button>
            {
              user.fakeBalance <= 0 &&
              <Button type="primary" htmlType="submit" className={styles.submit} onClick={() => navigate('/order/recharge')}>
                去充值
              </Button>
            }
          </div>
        </div>
      </Mask>
    </>
  )
}


export default Simple;