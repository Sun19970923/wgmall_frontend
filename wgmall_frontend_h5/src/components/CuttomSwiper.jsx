/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-14 17:18:38
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-10 04:02:47
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\components\swiper.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useRef } from 'react'
import { Button, Space, Swiper, Toast } from 'antd-mobile'

import styles from './index.module.less'


export default ({ images, onClick }) => {
  const ref = useRef(null)
  return (
    <>
      <Swiper
        loop
        onIndexChange={(i) => {
          console.log(i, 'onIndexChange1')
        }}
        style={{
          '--border-radius': '8px',
        }}
      >
        {images.map((item, index) => (
          <Swiper.Item key={index}>
            <div
              className={styles.content}
              style={{ height: '250px', padding: '16px' }}
              onClick={() => {
                onClick(index)
              }}
            >
              <img src={item} alt="" />
            </div>
          </Swiper.Item>
        ))}
      </Swiper>
    </>
  )
}
