/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-26 03:08:19
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-27 19:11:44
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\components\Hongbao.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect } from 'react'
import { Button, Mask, Space, Toast, Divider } from 'antd-mobile'
import styles from './Hongbao.module.less'
import { redbag } from '@/api/user'
import { useNavigate } from "react-router-dom";


export default ({ visible, onChange }) => {
  const navigate = useNavigate();
  const [num, setNum] = useState(0)

  const getHongbao = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    let res = await redbag({ userId: userinfo.id })
    console.log(res, 'res');

    if(res.code === 200){
        onChange()
        setTimeout(() => {
            navigate('/order')
        }, 2000);

        Toast.show({
            icon: 'success',
            content: res.message + 'Get amount $' + res.data.amount,
        })
    }
    
  }

  

  
  return (
    <>
        <Mask visible={visible} onMaskClick={() => onChange(false)}>
            <div className={styles.overlayContent}>
                <div className={styles.overlayOpen} onClick={() => getHongbao()}>
                    Open
                </div>

                <div className={styles.overlayText}>
                    <div className={styles.overlayTextTitle}>
                        恭喜发财，打开红包获得好礼
                    </div>

                    <div className={styles.overlayTextTitle2}>
                        打开红包，获得现金奖励
                    </div>
                </div>
            </div>
        </Mask>
    </>
  )
}
