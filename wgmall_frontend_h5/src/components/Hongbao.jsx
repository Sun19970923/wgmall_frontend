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

        if (res.code === 200) {
            onChange()
            setTimeout(() => {
                navigate('/order')
            }, 2000);

            Toast.show({
                content: '$' + res.data.amount,
                style: {
                    fontSize: '80px',  // 修改为你需要的字体大小
                        fontWeight: 'bold', // 可选：让字体更加醒目

                }
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
                            Congratulations！
                        </div>

                        <div className={styles.overlayTextTitle2}>
                            Finish Task, Get Reward
                        </div>
                    </div>
                </div>
            </Mask>
        </>
    )
}
