/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-31 06:02:13
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PullToRefresh, Button, Toast, Card, Space, TabBar, Tag, Grid, Popover, List, Tabs, Empty, Ellipsis } from 'antd-mobile'
import styles from './shopHome.module.less'
import { formatAmount } from '@/utils/utils'
import { shopHome, userInfo } from '@/api/user'
import { useEffect, useState } from 'react'
import { products, removeProduct } from '@/api/product'
import NavBar from '../../components/NavBar'
import LoadingMask from '../../components/Loading'
import ShopTabBar from '../../components/ShopTabBar'
import { useNavigate } from 'react-router-dom'

const ShopHome = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({}) // data
  const [activeIndex, setActiveIndex] = useState(0)
  const [loading, setLoading] = useState(0)
  const [shopInfo, setShopInfo] = useState({})
  const [msgList, setMsgList] = useState([])

  const getData = async () => {
    setLoading(true)
    let { id, shopId } = JSON.parse(localStorage.getItem('userInfo'))

    let res = await shopHome(id)
    let userData = await userInfo(id)
    console.log(userData.data, 'userData')
    setUser(userData.data || {})

    setShopInfo(res.data)

    let pro = await products(shopId)

    setMsgList(pro.data)

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className={styles.indexContainer}>
      <LoadingMask visible={loading} />

      <div className={styles.indexBody}>
        <NavBar title={'卖家中心'}></NavBar>

        <div style={{ padding: '12px', textAlign: 'left', boxSizing: 'border-box' }}>
          <Card
            style={{
              width: '100%',
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 600 }}>店铺名称: {shopInfo.name}</div>
              <div style={{ marginTop: 8, fontSize: '16px' }}>
                <Tag color="primary" style={{ marginRight: 8, fontSize: '16px' }}>
                  Level: {shopInfo.level}
                </Tag>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, fontSize: '16px' }}>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: '#888' }}>手机号码：</span>
                <span style={{ fontWeight: 500 }}>{shopInfo.phone}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: '#888' }}>详细介绍：</span>
                <span style={{ marginTop: 4, color: '#333' }}>{shopInfo.description}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: '#888' }}>主要营业类型：</span>
                <span style={{ marginTop: 4, color: '#333' }}>{shopInfo.mainProductTypes}</span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span style={{ color: '#888' }}>最大数量：</span>
                <span style={{ marginTop: 4, color: '#333' }}>{shopInfo.maxListings}</span>
              </div>
            </div>
          </Card>

          <br />
          <br />

          <Card
            style={{
              width: '100%',
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <div style={{ fontSize: 18, fontWeight: 400 }}>钱包</div>
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 30px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ marginTop: 18, fontSize: '16px' }}>
                  <p>{formatAmount(user.fakeBalance || 0)}</p>
                  <p style={{ fontSize: '14px', color: '#888' }}>余额</p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }}>
                  <p>{formatAmount(user.totalCredit || 0)}</p>
                  <p style={{ fontSize: '14px', color: '#888' }}>总信用额度</p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }}>
                  <p>{formatAmount(user.credit || 0)}</p>
                  <p style={{ fontSize: '14px', color: '#888' }}>剩余信用额度</p>
                </div>
              </div>
            </div>
          </Card>

          <br />
          <br />

          <Card
            style={{
              width: '100%',
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'left', marginBottom: 16 }} className={styles.order}>
              <div style={{ fontSize: 18, fontWeight: 400 }}>订单</div>
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item} onClick={() => navigate('/user/shopOrder?type=ALL')}>
                  <img src={require('@/assets/icon/all.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>All</p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item} onClick={() => navigate('/user/shopOrder?type=PENDING')}>
                  <img src={require('@/assets/icon/pending.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>Pending</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=PROCESSING')}>
                  <img src={require('@/assets/icon/Processing-filled.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>PROCESSING</p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=SHIPPED')}>
                  <img src={require('@/assets/icon/Shipped.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>SHIPPED</p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=WAREHOUSE')}>
                  <img src={require('@/assets/icon/warehouse.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>WAREHOUSE</p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=TRANSPORTING')}>
                  <img src={require('@/assets/icon/icon_line_transporting.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>TRANSPORTING</p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', textAlign: 'center' }}>
                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=DELIVERED')}>
                  <img src={require('@/assets/icon/Delivered.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>DELIVERED</p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=COMPLETED')}>
                  <img src={require('@/assets/icon/completed.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>COMPLETED </p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=REFUNDING')}>
                  <img src={require('@/assets/icon/-refunding.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>REFUNDING </p>
                </div>

                <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=REFUNDED')}>
                  <img src={require('@/assets/icon/refunded.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>REFUNDED </p>
                </div>
              </div>
            </div>
          </Card>

          <br />
          <br />

          <div
            style={{
              width: '100%',
              borderRadius: 16,
              boxSizing: 'border-box',
            }}
            onClick={() => navigate('/home')}
          >
            <img
              style={{
                width: '100%',
                borderRadius: 16,
                boxSizing: 'border-box',
              }}
              src={require('@/assets/photo_2025-07-14_17-29-09.jpg')}
              alt=""
            />
          </div>

          <br />
          <br />

          <Card
            style={{
              width: '100%',
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'left', marginBottom: 16 }} className={styles.chunk}>
              <div style={{ fontSize: 18, fontWeight: 400 }}>功能模块</div>
              <br />
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignContent: 'center', textAlign: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 20 }} onClick={() => navigate('/user/message')}>
                <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                  <img src={require('@/assets/icon/email.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>站内信</p>
                </div>
                <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/order/meeting')}>
                <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                  <img src={require('@/assets/icon/kefu.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>客服</p>
                </div>
                <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/myShop')}>
                <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                  <img src={require('@/assets/icon/dianpu.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>店铺</p>
                </div>
                <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/product')}>
                <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                  <img src={require('@/assets/icon/order1.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>进货</p>
                </div>
                <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/finance')}>
                <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                  <img src={require('@/assets/icon/diyadaikuan.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>创业基金</p>
                </div>
                <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/wallect')}>
                <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                  <img src={require('@/assets/icon/tixian.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>提现</p>
                </div>
                <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/wallect')}>
                <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                  <img src={require('@/assets/icon/chongzhijiaofei.png')} alt="" />
                  <p style={{ fontSize: '14px', color: '#888' }}>充值</p>
                </div>
                <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <ShopTabBar></ShopTabBar>
    </div>
  )
}

export default ShopHome
