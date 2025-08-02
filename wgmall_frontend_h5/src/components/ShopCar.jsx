/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-15 20:21:20
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 02:17:29
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\components\NavBar.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Stepper   } from 'antd-mobile'
import { CloseOutline, MoreOutline, SearchOutline } from 'antd-mobile-icons'
import React, { useEffect, useMemo } from 'react'
import { useNavigate } from "react-router-dom";
import Styles from './ShopCar.module.less'
import { useState } from 'react'
import { uploaderToUserid } from '@/api/user'

const ShopCar = ({ item, type = 0, onBuy, onMeeting }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState(1);
  const [upData, setUpData] = useState(0)

  const getData = async (item) => {
    let res = await uploaderToUserid({ uploader: item.uploader })
    console.log(res, 'res');
    setUpData(res.data || 0)
  }

  useEffect(() => {
      if(item.uploader){
        getData(item)
      }
      
  }, [item])

  const count = useMemo(() => {
    return Number(value * item.price).toFixed(2)
  }, [value, item.price])


  return (
    <>
        <div className={Styles.ShopCar}>
            <div className={Styles.left}>
                <div onClick={() => {
                    let user = JSON.parse(localStorage.getItem('userInfo'))
                    if(upData == 0){
                       return navigate('/netWork404')
                    }
                    navigate('/user/userMeeting?userId=' + user.id + "&shopId=" + upData)
                }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '12px', color: '#333', gap: 8, marginRight: '10px', padding: '0 10px' }}>
                    <img style={{ width: '20px' }} src={require('@/assets/icon/kefu.png')} alt="" />
                    客服
                </div>
                
                {
                    type == 0 ?
                    <span style={{ marginRight: '10px' }}>$ {count}</span>
                    :
                    <span style={{ marginRight: '10px', fontSize: '22px', paddingLeft: '44px', color: '#333' }}>结账:  $ {item.count * item.price}</span>
                }
                {
                    type !== 1 &&

                    <Stepper
                        min={0}           // 最小值为0
                        max={99}
                        value={value}
                        onChange={setValue}
                        style={{ '--input-width': '68px', '--input-font-size': '18px', '--height': '38px' }}
                    />

                }
            </div>

            {
                type == 1 ?
                
                <div className={Styles.buy2} onClick={() => {
                    onBuy()
                }}>
                    提交订单
                </div>

                :

                <div className={Styles.buy} onClick={() => {
                    let item = JSON.parse(localStorage.getItem('item'))
                    item = {...item, count: value }
                    localStorage.setItem('item', JSON.stringify(item))
                    navigate('/pay')
                }}>
                    立即购买
                </div>
            }
        </div>
    </>
  )
}

export default ShopCar;