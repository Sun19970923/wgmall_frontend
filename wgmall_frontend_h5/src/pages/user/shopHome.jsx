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
import { useTranslation } from 'react-i18next'

const ShopHome = () => {
  const { t } = useTranslation()
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
          <NavBar title={t('shophome.sellerCenter')}></NavBar>

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
                <div style={{ fontSize: 22, fontWeight: 600 }}>
                  {t('shophome.shopName')}: {shopInfo.name}
                </div>
                <div style={{ marginTop: 8, fontSize: '16px' }}>
                  <Tag color="primary" style={{ marginRight: 8, fontSize: '16px' }}>
                    {t('shophome.level')}: {shopInfo.level}
                  </Tag>
                </div>
              </div>
              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16, fontSize: '16px' }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>{t('shophome.phone')}：</span>
                  <span style={{ fontWeight: 500 }}>{shopInfo.phone}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>{t('shophome.description')}：</span>
                  <span style={{ marginTop: 4, color: '#333' }}>{shopInfo.description}</span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>{t('shophome.mainProductTypes')}：</span>
                  <span style={{ marginTop: 4, color: '#333' }}>
    {shopInfo.mainProductTypes
        ? t(`shophome.mainType.${shopInfo.mainProductTypes}`)
        : ''}
  </span>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ color: '#888' }}>{t('shophome.maxListings')}：</span>
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
                <div style={{ fontSize: 18, fontWeight: 400 }}>{t('shophome.wallet')}</div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 30px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ marginTop: 18, fontSize: '16px' }}>
                    <p>{formatAmount(user.fakeBalance || 0)}</p>
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.balance')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }}>
                    <p>{formatAmount(user.totalCredit || 0)}</p>
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.totalCredit')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }}>
                    <p>{formatAmount(user.credit || 0)}</p>
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.remainingCredit')}</p>
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
                <div style={{ fontSize: 18, fontWeight: 400 }}>{t('shophome.orders')}</div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 50px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item} onClick={() => navigate('/user/shopOrder?type=ALL')}>
                    <img src={require('@/assets/icon/all.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderAll')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item} onClick={() => navigate('/user/shopOrder?type=PENDING')}>
                    <img src={require('@/assets/icon/pending.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderPending')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', textAlign: 'center', borderTop: '1px solid #f0f0f0' }}>
                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=PROCESSING')}>
                    <img src={require('@/assets/icon/Processing-filled.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderProcessing')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=SHIPPED')}>
                    <img src={require('@/assets/icon/Shipped.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderShipped')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=WAREHOUSE')}>
                    <img src={require('@/assets/icon/warehouse.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderWarehouse')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=TRANSPORTING')}>
                    <img src={require('@/assets/icon/icon_line_transporting.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderTransporting')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', textAlign: 'center' }}>
                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=DELIVERED')}>
                    <img src={require('@/assets/icon/Delivered.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderDelivered')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=COMPLETED')}>
                    <img src={require('@/assets/icon/completed.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderCompleted')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=REFUNDING')}>
                    <img src={require('@/assets/icon/-refunding.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderRefunding')}</p>
                  </div>

                  <div style={{ marginTop: 18, fontSize: '16px' }} className={styles.item2} onClick={() => navigate('/user/shopOrder?type=REFUNDED')}>
                    <img src={require('@/assets/icon/refunded.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.orderRefunded')}</p>
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
                <div style={{ fontSize: 18, fontWeight: 400 }}>{t('shophome.featureModule')}</div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignContent: 'center', textAlign: 'center', borderTop: '1px solid #f0f0f0', paddingTop: 20 }} onClick={() => navigate('/user/message')}>
                  <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                    <img src={require('@/assets/icon/email.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.inbox')}</p>
                  </div>
                  <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/order/meeting')}>
                  <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                    <img src={require('@/assets/icon/kefu.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.customerService')}</p>
                  </div>
                  <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/myShop')}>
                  <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                    <img src={require('@/assets/icon/dianpu.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.shop')}</p>
                  </div>
                  <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/product')}>
                  <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                    <img src={require('@/assets/icon/order1.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.purchase')}</p>
                  </div>
                  <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/finance')}>
                  <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                    <img src={require('@/assets/icon/diyadaikuan.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.startupFund')}</p>
                  </div>
                  <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/wallect')}>
                  <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                    <img src={require('@/assets/icon/tixian.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.withdraw')}</p>
                  </div>
                  <img style={{ width: '16px', height: '16px' }} src={require('@/assets/icon/right.png')} alt="" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', textAlign: 'center', marginTop: 20 }} onClick={() => navigate('/user/wallect')}>
                  <div style={{ fontSize: '16px', display: 'flex', alignItems: 'center' }} className={styles.item}>
                    <img src={require('@/assets/icon/chongzhijiaofei.png')} alt="" />
                    <p style={{ fontSize: '14px', color: '#888' }}>{t('shophome.recharge')}</p>
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
