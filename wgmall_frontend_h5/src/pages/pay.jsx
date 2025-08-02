/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-31 03:52:09
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Toast, NoticeBar, Tabs, Empty, Ellipsis } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import styles from '@/assets/css/pay.less'
import { formatAmount } from '@/utils/utils'
import { AppOutline, MessageOutline, MessageFill, UnorderedListOutline, UserOutline, AppstoreOutline, BillOutline, FingerdownOutline } from 'antd-mobile-icons'
import Swiper from '../components/Swiper'
import { info, getAddress } from '@/api/user'
import { buy } from '@/api/product'
import { useEffect, useState } from 'react'
import { wishlistAdd } from '@/api/product'
import Countdown from '../components/Countdown';
import ShopCar from '../components/ShopCar';
import NavBar from "../components/NavBar";


const Pay = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({}) // data
  const [data, setData] = useState({}) // data
  const [address, setAddress] = useState(false) // data

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    let item = JSON.parse(localStorage.getItem('item'))

    console.log(item, '222');
    

    const res = await getAddress({ userId: userinfo.id })

    setUser(userinfo)
    setData(item)

    console.log(res, 'resres');

    if(res.code == 200){
        setAddress(res.data.address)
    }
  }

 
  //付款
  const buyItem = async () => {
    if(!address) {
        return Toast.show({
            icon: 'fail',
            content: '请添加收货地址',
        })
    }
    let item = JSON.parse(localStorage.getItem('item'))

    let res = await buy({
        "userId": user.id,
        "productId": item.id,
        "quantity": item.count,
        "totalAmount": Number(item.count * item.price),
        "sellerName": item.uploader
    })
    console.log(res, 'resres');
    if(res.code == 200){
        Toast.show({
            icon: 'success',
            content: res.message,
        })

        setTimeout(() => {
            navigate('/home')
        }, 1000);
    }
  }


  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={styles.indexContainer}>
      <NavBar title={'结账'}></NavBar>


      <NoticeBar
        color='success'
        shape='rounded'
        bordered={false}
        speed="100"
        content={'专为您提供的免费特快物流服务 · 送达超时赔付CA$26.00抵用金 · 所有数据均受到保护'}
      />


      <div className={styles.indexBody}>
        {
            address ? 
            <div className={styles.address}>
                <div className={styles.addressTitle}>   
                    <img src={require('@/assets/icon/black_zuobiao.png')} alt="" />
                    <p>{address.country + " " + address.province + " " + address.city + " " + address.district + " " + address.street}</p>
                </div>

                <div className={styles.addressTitle}>   
                    <img src={require('@/assets/icon/user.png')} alt="" />
                    <p>{address.receiverName + " " + address.receiverPhone + " " + address.detail }</p>
                </div>
            </div>
            :
            <div className={styles.notDat} onClick={() => navigate('/user/address')}>
                <div className={styles.button}>添加收货地址</div>
            </div>
        }

        <div className={styles.line}>
            <img src={require('@/assets/liune.png')} alt="" />
        </div>
      </div>

      <PayItem data={data}></PayItem>

      <ViewItem></ViewItem>

      <ViewItem2></ViewItem2>

      <ViewItem3></ViewItem3>

      <ViewItem4></ViewItem4>
      
      <Express />

      
      {
        data.id &&
        <ShopCar type={1} item={data} onBuy={() => buyItem()} />
      }
    </div>
  )
}

function PayItem ({ data }) {
    return (
        <div className={styles.PayItem}>
            <img src={baseApi + data.imagePath} alt="" />
            <h3>{data.name}</h3>
            <p>Price: $ {data.price}  &nbsp; &nbsp;&nbsp;  Type: {data.type}  &nbsp; &nbsp;&nbsp; Uploader: {data.uploader}</p>
            <div>
                特快物流：免费， 配送时间：4-12 个工作日 最快4个工作日送达
            </div>
        </div>
    )
}



function ViewItem () {
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}>Temu 的树木捐赠计划</div>
            <div className={styles.content}>
                Temu 及其用户已向 Trees for the Future 捐赠资金，用于在撒哈拉以南非洲地区植树
            </div>
        </div>
    )
}

function ViewItem2 () {
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}> <img src={require('@/assets/icon/dunpai.png')} alt="" /> 与 Temu 一起捐款</div>
            <div className={styles.content}>
                我们邀请您捐款 CA$0.49 来资助一棵树
            </div>
        </div>
    )
}


function ViewItem3 () {
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}><img src={require('@/assets/icon/car.png')} alt="" /> 物流保障</div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  送达超时赔付CA$26.00抵用金
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  商品损坏可退货
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  轨迹18天无更新可退款
            </div>
        </div>
    )
}

function ViewItem4 () {
    return (
        <div className={styles.ViewItem}>
            <div className={styles.title}><img src={require('@/assets/icon/dunpai.png')} alt="" /> Temu 保护您的卡信息</div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  Temu 在处理卡数据时遵循支付卡行业数据安全标准 (PCI DSS)
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  卡信息安全且不会被泄露
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  所有数据均已加密处理
            </div>
            <div className={styles.content}>
                <img src={require('@/assets/icon/success.png')} alt="" />  Temu绝不会出售您的卡信息
            </div>
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

export default Pay
