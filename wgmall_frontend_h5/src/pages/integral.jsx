/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 04:28:25
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState } from 'react'
import { List, Button, Modal, Empty, Toast } from 'antd-mobile'
import { MessageOutline, FileOutline, ExclamationCircleFill } from 'antd-mobile-icons'
import NavBar from '../components/NavBar'
import { redbag } from '@/api/user'
import Hongbao from '../components/Hongbao'
import styles from '@/assets/css/integral.less'
import { useNavigate } from "react-router-dom";



export default function Integral() {
  const navigate = useNavigate();
  const [msgList, setMsgList] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [current, setCurrent] = useState({ page: 0 })
  const [hongbaoVisible, setHongbaoVisible] = useState(false)

  const submit = async () => {
    Modal.clear()
    setHongbaoVisible(true)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
      <NavBar title={'Temu Red Packet'} style={{ height: '100px' }}></NavBar>

      <Hongbao onChange={() => setHongbaoVisible(false)} visible={hongbaoVisible}></Hongbao>

      <div className={styles.integral}>
        <div className={styles.button} onClick={() => submit()}>
            
        </div>
      </div>
    </div>
  )
}