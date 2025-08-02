/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 05:57:10
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PullToRefresh, Button, Toast, Card, Space, TabBar, Badge, Divider, Grid, SearchBar, Avatar, Tabs, Empty, Ellipsis } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from '@/assets/css/details.less'
import { formatAmount } from '@/utils/utils'
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline, AppstoreOutline, BillOutline, FingerdownOutline } from 'antd-mobile-icons'
import Swiper from '../components/Swiper'
import { info } from '@/api/user'
import { useEffect, useState } from 'react'
import { wishlistAdd } from '@/api/product'
import Countdown from '../components/Countdown';
import ShopCar from '../components/ShopCar';



const Home = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({}) // data

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('item'))

    console.log(userinfo, '111')

    setUser(userinfo)
  }

  const addCar = async (user) => {
    let avat = JSON.parse(localStorage.getItem('userInfo'))

    let res = await wishlistAdd({ userId: avat.id, productId: user.id })

    console.log(res, 'resres');
    if(res.code == 200){
      Toast.show({
        content: '添加成功',
        icon: 'success'
      })
    }
    
    
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={styles.indexContainer}>
      <div className={styles.header}>
        <div style={{ display: 'flex', gap: '1em' }}>
          <img src={require('@/assets/logo.webp')} onClick={() => {
            navigate('/home')
          }} alt="" />
          <div>
            <SearchBar
              placeholder="请输入内容"
              onFocus={() => {
                navigate('/searchPage')
                setFouce(true)
              }}
            />
          </div>
        </div>
        <div
          onClick={() => {
            navigate('/my')
          }}
        >
          <Avatar src="" style={{ '--size': '38px', '--border-radius': '50%' }} />
        </div>
      </div>

      <div className={styles.indexBody}>
        <img className={styles.banner} src={baseApi + user.imagePath} alt="" />

        <div className={styles.product_info}>
          <h2>{user.name}</h2>
          <div className={styles.sales}>
            <span>已售：{formatAmount(user.sales || 0)}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>分类：{user.type}</span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>卖家：{user.uploader}</span>
          </div>
          <div className={styles.price}>
            $ {formatAmount(user.price || 0)}
            <div onClick={() => addCar(user)}>
                <img src={require('@/assets/icon/xinyuan.png')} alt="" />
                添加到心愿单
            </div>
          </div>


          <div className={styles.huodong}>
            <div className={styles.huodong_title}>
                <span style={{  marginRight: '20px' }}>大促降价 </span>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    倒计时：
                    <Countdown />
                </div>
            </div>
          </div>
        </div>


      </div>

      
      <Express />

      
      <ShopCar item={user} />
    </div>
  )
}


function Express () {
    return (
        <div className={styles.Express}>
            <div className={styles.title}>
                <div>
                    <img src={require('@/assets/icon/car.png')} alt="" />
                    <span>包邮</span>
                </div>
                
                <div>
                    标快：免费
                    <span>最快6个工作日送达</span>
                </div>
            </div>

            <div className={styles.title}>
                <div>
                    <img src={require('@/assets/icon/dunpai.png')} alt="" />
                    <span>支付安全 • 隐私保障</span>
                </div>
                
            </div>

        </div>
    )
}

export default Home
