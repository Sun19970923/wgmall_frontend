/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-02 00:35:40
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PullToRefresh, Button, Toast, Card, Space, TabBar, Badge, Divider, Grid, SearchBar, Avatar, Tabs, Empty, Ellipsis } from "antd-mobile";
import { useNavigate } from "react-router-dom";
import styles from "@/assets/css/home.less";
import { formatAmount } from '@/utils/utils'
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
  AppstoreOutline,
  BillOutline,
  FingerdownOutline
} from 'antd-mobile-icons'
import Swiper from "../components/Swiper";
import { info } from '@/api/user';
import { useEffect, useState } from "react";
import { random, type, search } from '@/api/product';
import Hongbao from "../components/Hongbao";
import LoadingMask from '../components/Loading';
import { useTranslation } from 'react-i18next';


const Home = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [user, setUser] = useState({}); // data
  const [shouru, setShouru] = useState({}); // data
  const [fouce, setFouce] = useState(false); // data
  const [activeIndex, setActiveIndex] = useState(0)
  const [list, setList] = useState([]); // data
  const [hongbaoVisible, setHongbaoVisible] = useState(false)
  const [loading, setLoading] = useState(false);


  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    getRandom()

    if (!userinfo) return

    let infoData = await info({ userId: userinfo?.id })

    setUser(infoData.data)

  }



  const getRandom = async () => {
    setLoading(true)

    let randomData = await random()

    console.log(randomData, 'randomData');

    setList(randomData || [])

    setLoading(false)
  }


  const getType = async (key) => {

    if (key === 'All') {
      return getRandom()
    }


    setLoading(true)
    let randomData = await type({ type: key })

    setLoading(false)


    console.log(randomData, 'randomData');

    setList(randomData || [])

  }

  const searchData = async (val) => {
    console.log(val, 'val');
    let res = await search({
      keyword: val,
      page: 0,
      size: 8
    })
    if (res.code == 200) {
      setList(res.data || [])
    }
  }




  const tabItems = [
    { key: 'All', title: t('home.tabs.all') },
    { key: 'WOMEN', title: t('home.tabs.women') },
    { key: 'HOME_GOODS', title: t('home.tabs.homeGoods') },
    { key: 'MENS', title: t('home.tabs.mens') },
    { key: 'SPORTS', title: t('home.tabs.sports') },
    { key: 'INDUSTRIAL_GOODS', title: t('home.tabs.industrialGoods') },
    { key: 'CRAFTS', title: t('home.tabs.crafts') },
    { key: 'JEWELRY', title: t('home.tabs.jewelry') },
    { key: 'TOYS', title: t('home.tabs.toys') },
    { key: 'ELECTRONICS', title: t('home.tabs.electronics') },
    { key: 'GARDEN', title: t('home.tabs.garden') },
    { key: 'OFFICE_SUPPLIES', title: t('home.tabs.officeSupplies') },
    { key: 'BAGS', title: t('home.tabs.bags') },
    { key: 'CHILDREN', title: t('home.tabs.children') },
    { key: 'BEAUTY', title: t('home.tabs.beauty') },
    { key: 'HEALTH', title: t('home.tabs.health') },
    { key: 'PETS', title: t('home.tabs.pets') },
    { key: 'APPLIANCES', title: t('home.tabs.appliances') },
    { key: 'FOOD', title: t('home.tabs.food') },
  ]



  // 0 签到  1领红包  3 到刷页
  const handleClick = async (type) => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    if (!userinfo) {
      return navigate('/login')
    }

    let infoData = await info({ userId: userinfo.id })

    if (infoData.code !== 200) return


    localStorage.setItem('userInfo', JSON.stringify(infoData.data.user))

    setUser(infoData.data.user)

    if (type == '0') {
      // setHongbaoVisible(true)
      navigate('/integral')
    }

    if (type == '1') {
      navigate('/order')
    }


    if (type == '2') {
      navigate('/user/apply')
    }
  }


  useEffect(() => {
    getData()
  }, [])



  return (
    <div className={styles.indexContainer}>
      <LoadingMask visible={loading} />



      <Hongbao onChange={() => setHongbaoVisible(false)} visible={hongbaoVisible}></Hongbao>
      <div className={styles.indexBody}>
        <PullToRefresh
          onRefresh={() => {
            getData()
          }}
        >
          <div className={styles.header}>
            <div style={{ display: 'flex', gap: '1em' }}>
              <img src={require('@/assets/logo.webp')} onClick={() => {
                navigate('/home')
              }} alt="" />
              <div>
                <SearchBar
                  placeholder={t('home.header.search.placeholder')}
                  onFocus={() => {
                    setFouce(true)
                    navigate('/searchPage')
                  }}
                  onSearch={val => {
                    searchData(val)
                  }}
                />
              </div>
            </div>
            <div onClick={() => {
              navigate('/my')
            }}>
              <Avatar src={require('@/assets/header.png')} fit="fill" style={{ '--size': '38px', '--border-radius': '50%' }} />
            </div>
          </div>

          <Card
            headerStyle={{
              color: '#1677ff',
            }}
            bodyClassName={styles.customBody}
            title=''
          >
            <div className={styles.guanggao}>
              <div className={styles.guanggao_left}>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" color="#0A8800"><path d="M930.4 227.8l-108.2-84.8-409.5 522.4-243.1-188.7-84.3 108.6 351.2 272.7z"></path></svg>
                  <span style={{ color: '#0A8800' }}>{t('home.banner.platformShipping')}</span>
                </div>
                <br />

                <div style={{ fontSize: '12px' }}>
                  {t('home.banner.exclusiveOffer')}
                </div>
              </div>

              <div className={styles.guanggao_left}>
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor" color="#000000"><path d="M910.3 122.4c30.6 0 56.4 21.5 62.7 51l1 6.4 0.3 6.6 0 129.9c0 30.6-21.5 56.4-51 62.6l-6.4 1-6.6 0.4-6.7 0 0.1 442.2c0 36.2-24.3 67-58.1 76.4l-6.9 1.6-7.1 1-7.3 0.3-634.9 0c-38.6 0-71.1-27.6-78-65l-1-7.1-0.3-7.2-0.1-442.3-3.8-0.2c-25.6-2.6-46.9-20.3-54.6-44.5l-1.6-6.2-1-6.5-0.4-6.5 0-129.9c0-30.6 21.5-56.4 51.1-62.7l6.4-1 6.5-0.3 797.7 0z m-83.5 257.8l-640 0 0.1 442.3 0.4 1.7 0.4 0.5 1.7 0.3 634.9 0 1.1-0.2 1.2-0.6 0.3-1.7-0.1-442.3z m-328.9 101.6c10.5 10.5 11.9 27.1 3.4 39.4l-3.4 4-52.3 49.9 184.2 0.1c15.3 0 27.9 11.1 30.3 25.7l0.4 5c0 15.1-11 27.9-26 30.4l-4.7 0.3-181.9 0 50 50c9.2 9.2 11.5 23 6.1 34.6l-2.7 4.8-3.4 4c-10.5 10.5-27.1 11.9-39.4 3.5l-4.1-3.5-102.4-102.4c-10.5-10.5-11.9-27.1-3.4-39.3l3.4-4.1 102.4-102.4c12-12 31.4-12 43.5 0z m399.5-282.7l-772 0 0 104.4 772 0 0-104.4z"></path></svg>
                  <span>{t('home.banner.nopackagefee')}</span>
                </div>
                <br />

                <div style={{ fontSize: '12px' }}>
                  {t('home.banner.logisticsWorryFree')}
                </div>
              </div>
            </div>


            <div className={styles.tag}>
              <div className={styles.tag_left}>
                <img src={require('@/assets/icon/aggw.png')} alt="" />
                <span>{t('home.tag.whyChooseTemu')}</span>
              </div>

              <div className={styles.tag_right}>
                {t('home.tag.paymentSecurity')}
              </div>
            </div>

            <Card>
              <Swiper onClick={(type) => handleClick(type)}></Swiper>
            </Card>

            <br />

            <Tabs
              activeKey={tabItems[activeIndex].key}
              defaultActiveKey='All' style={{ '--title-font-size': '18px', '--content-padding': '18px', '--active-line-color': '#333', '--active-title-color': '#333' }}
              onChange={key => {
                const index = tabItems.findIndex(item => item.key === key)
                getType(key)
                setActiveIndex(index)
              }}
            >
              {tabItems.map(item => (
                <Tabs.Tab title={item.title} key={item.key} />
              ))}
            </Tabs>

            {
              list.length > 0 ?
                <div className={styles.goods}>
                  {
                    list.map((item, index) => {
                      return (
                          <div
                              key={item.id || index}  // ✅ 加 key
                              className={styles.item}
                              onClick={() => {
                                localStorage.setItem('item', JSON.stringify(item))
                                navigate('/details?id=' + item.id)
                              }}
                          >
                            <img src={baseApi + item.imagePath} alt="" />
                            <Ellipsis direction='end' content={item.name} />
                            <div className={styles.price}>
                              <span>$ {item.price}</span>
                              <span className={styles.sale}>{t('home.goods.sales')}：{item.sales}</span>
                            </div>
                          </div>
                      )
                    })
                  }
                </div>
                :
                <Empty />
            }
          </Card>

          <br />

          <Gonsi t={t} />
        </PullToRefresh>


      </div>

    </div>
  );
};


function Gonsi({ t }) {
  return (
    <div className={styles.Gonsi}>
      <div className={styles.Gonsi_menu}>
        <div className={styles.Gonsi_menu_item}>
          <a href="/order/meeting">
            <span>{t('home.footer.customerService')}</span>
          </a>
        </div>
        <div className={styles.Gonsi_menu_item}>
          <span>{t('home.footer.siteMap')}</span>
        </div>
        <div className={styles.Gonsi_menu_item}>
          <span>{t('home.footer.shoppingWorryFree')}</span>
        </div>
        <div className={styles.Gonsi_menu_item}>
          <span>{t('home.footer.returnAndRefundPolicy')}</span>
        </div>
        <div className={styles.Gonsi_menu_item}>
          <span>{t('home.footer.intellectualPropertyPolicy')}</span>
        </div>
        <div className={styles.Gonsi_menu_item}>
          <span>{t('home.footer.paymentInformation')}</span>
        </div>
      </div>

      <div className={styles.links}>
        <a href="https://www.instagram.com/temu_can/" class="a-2Tl9q" rel="nofollow" role="button" aria-label="https://www.instagram.com/temu_can/"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="#7F7F7F" class="snsIcon-1D0Pq" alt=""><path d="M571.3 107.8c35.4 0.1 55 0.4 72.6 1l14.3 0.5c6.4 0.3 13 0.6 20.4 0.9 43 2 72.4 8.8 98.2 18.8 26.6 10.3 49.1 24.2 71.6 46.6 22.5 22.5 36.3 45 46.6 71.6 10 25.7 16.8 55.1 18.8 98.1 0.4 9.4 0.8 17.4 1.1 25.3l0.3 9.5c0.6 19.2 0.9 40.9 1 82.7l0 22.6c0 8.2 0 17 0 26.6l0 13.8c0 4.4 0 8.7 0 12.7l0 22.7c-0.1 41.8-0.4 63.5-1 82.7l-0.3 9.5c-0.3 7.9-0.7 15.9-1.1 25.3-2 43-8.8 72.4-18.8 98.1-10.3 26.6-24.2 49.1-46.6 71.6-22.5 22.5-45 36.3-71.6 46.6-25.7 10-55.1 16.8-98.2 18.8-9.4 0.4-17.4 0.8-25.2 1.1l-9.5 0.3c-19.2 0.6-40.9 0.9-82.7 1l-22.7 0c-8.2 0-17 0-26.5 0l-13.8 0c-4.4 0-8.7 0-12.8 0l-22.6 0c-41.8-0.1-63.5-0.4-82.7-1l-9.5-0.3c-7.9-0.3-15.9-0.7-25.3-1.1-43-2-72.4-8.8-98.1-18.8-26.6-10.3-49.1-24.2-71.6-46.6-22.5-22.5-36.3-45-46.6-71.6-10-25.7-16.8-55.1-18.8-98.1-0.3-7.5-0.6-14.1-0.9-20.5l-0.5-14.3c-0.6-17.6-0.8-37.3-1-72.6l0-118.6c0.1-35.4 0.4-55 1-72.6l0.5-14.3c0.3-6.4 0.6-13 0.9-20.5 2-43 8.8-72.4 18.8-98.1 10.3-26.6 24.2-49.1 46.6-71.6 22.5-22.5 45-36.3 71.6-46.6 25.7-10 55.1-16.8 98.1-18.8 7.5-0.3 14.1-0.6 20.5-0.9l14.3-0.5c17.6-0.6 37.3-0.8 72.6-1z m-33.2 72.8l-52.2 0c-4 0-7.9 0-11.6 0l-20.5 0.1c-37.8 0.1-57.1 0.4-75.7 1l-9.3 0.4c-6.3 0.3-12.8 0.5-20.2 0.8-39.4 1.8-60.8 8.4-75 14-18.9 7.3-32.3 16.1-46.5 30.2-14.1 14.1-22.9 27.6-30.2 46.5-5.5 14.2-12.1 35.6-14 75-0.3 7.4-0.6 13.9-0.8 20.2l-0.4 9.3c-0.6 18.6-0.9 37.9-1 75.7l-0.1 20.5c0 3.7 0 7.6 0 11.6l0 52.2c0 4 0 7.9 0 11.5l0.1 20.6c0.1 37.8 0.4 57.1 1 75.6l0.4 9.3c0.3 6.3 0.5 12.8 0.8 20.2 1.8 39.4 8.4 60.8 14 75.1 7.3 18.9 16.1 32.3 30.2 46.5 14.1 14.1 27.6 22.9 46.5 30.2 14.2 5.5 35.6 12.1 75 13.9 7.4 0.3 13.9 0.6 20.2 0.9l9.3 0.4c21.6 0.7 44.3 1 96.2 1.1l75.3 0c51.9-0.1 74.6-0.4 96.2-1.1l9.3-0.4c6.3-0.3 12.8-0.5 20.2-0.9 39.4-1.8 60.8-8.4 75.1-13.9 18.9-7.3 32.3-16.1 46.5-30.2 14.1-14.1 22.9-27.6 30.2-46.5 5.5-14.2 12.1-35.6 13.9-75.1 0.3-7.4 0.6-13.9 0.9-20.2l0.4-9.3c0.7-21.6 1-44.3 1.1-96.2l0-75.3c-0.1-51.9-0.4-74.6-1.1-96.2l-0.4-9.3c-0.3-6.3-0.5-12.8-0.9-20.2-1.8-39.4-8.4-60.8-13.9-75-7.3-18.9-16.1-32.3-30.2-46.5-14.1-14.1-27.6-22.9-46.5-30.2-14.2-5.5-35.6-12.1-75.1-14-7.4-0.3-13.9-0.6-20.2-0.8l-9.3-0.4c-18.6-0.6-37.9-0.9-75.6-1l-20.6-0.1c-3.7 0-7.6 0-11.5 0z m-26.1 123.8c114.6 0 207.6 92.9 207.6 207.6 0 114.6-92.9 207.6-207.6 207.6-114.6 0-207.6-92.9-207.6-207.6 0-114.6 92.9-207.6 207.6-207.6z m0 72.8c-74.4 0-134.7 60.3-134.8 134.8 0 74.4 60.3 134.7 134.8 134.7 74.4 0 134.7-60.3 134.7-134.7 0-74.4-60.3-134.7-134.7-134.8z m215.8-129.5c26.8 0 48.5 21.7 48.5 48.5 0 26.8-21.7 48.5-48.5 48.5-26.8 0-48.5-21.7-48.5-48.5 0-26.8 21.7-48.5 48.5-48.5z"></path></svg></a>
        <a href="https://www.facebook.com/TemuCanada/" class="a-2Tl9q" rel="nofollow" role="button" aria-label="https://www.facebook.com/TemuCanada/"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="#7F7F7F" class="snsIcon-1D0Pq" alt=""><path d="M607.5 250.3c-98.5 0-162.9 60.1-162.9 168.8l0 0 0 95.5-109.4 0 0 125.4 109.4 0 0 303.2c-206.1-32.5-363.8-212-363.8-428.6 0-239.6 193-433.8 431.2-433.8 238.1 0 431.2 194.2 431.2 433.8 0 216.5-157.7 396-363.8 428.6l0 0 0-303.2 100.4 0 19.1-125.4-119.5 0 0-81.3c0-34.3 16.7-67.7 70.2-67.8l54.4 0 0-106.7c0 0-49.3-8.5-96.5-8.5z"></path></svg></a>
        <a href="https://www.twitter.com/@shoptemu" class="a-2Tl9q" rel="nofollow" role="button" aria-label="https://www.twitter.com/@shoptemu"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="#7F7F7F" class="snsIcon-1D0Pq" alt=""><path d="M538,560.5l-30.8-44.1L261.8,165.5h105.6l198,283.2l30.8,44.1l257.3,368.1H748L538,560.5L538,560.5L538,560.5z   M632.2,451l290.1-337.3h-68.8L601.6,406.6L400.4,113.8H168.2l304.3,442.9L168.2,910.3H237l266-309.3l212.5,309.3h232.1L632.2,451  L632.2,451L632.2,451z"></path></svg></a>
        <a href="https://www.tiktok.com/@temu" class="a-2Tl9q" rel="nofollow" role="button" aria-label="https://www.tiktok.com/@temu"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="#7F7F7F" class="snsIcon-1D0Pq" alt=""><path d="M534 107.8l139.6 0c0 102.1 83.3 184.8 186.1 184.8l2.6-0.1 0 138.6-2.6 0.1 0 0c-69.2 0-133.4-21.4-186.1-58l0 288.9c0 140.3-114.6 254.1-256 254.1-141.3 0-255.9-113.8-255.9-254.1 0-140.3 114.6-254.1 255.9-254 7.8 0 15.6 0.3 23.3 1l0 139.9c-7.5-1.5-15.3-2.3-23.3-2.4-64.2 0-116.3 51.7-116.3 115.5 0 63.8 52.1 115.5 116.3 115.5 64.2 0 116.3-51.7 116.4-115.5l0-554.3z"></path></svg></a>
        <a href="https://www.youtube.com/@temu" class="a-2Tl9q" rel="nofollow" role="button" aria-label="https://www.youtube.com/@temu"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="#7F7F7F" class="snsIcon-1D0Pq" alt=""><path d="M523.2 188.6c76.9 0 148.1 1.6 213.7 4.7l32.4 1.7c103.5 5.9 187 87 195.8 190.3 3.3 38.7 5 78.3 5 118.6 0 33.9-1.2 67.8-3.5 101.7l-2.7 33.9c-9.5 102.6-92.5 182.9-195.4 188.9-78.1 4.6-161.8 6.9-251.3 7-80.6 0-156.4-1.7-227.2-5.2l-35-1.9c-103.2-6.1-186.4-86.8-195.5-189.8-3.8-42.3-5.6-84.9-5.6-127.7 0-42.2 1.8-84 5.4-125.4l0 0c9.1-103.2 92.5-184.1 196-189.9 80.7-4.6 170-6.8 267.9-6.9z m-99 192.4l0 263.6 230.9-130.1-230.9-133.5z"></path></svg></a>
        <a href="https://www.pinterest.com/shoptemu/" class="a-2Tl9q" rel="nofollow" role="button" aria-label="https://www.pinterest.com/shoptemu/"><svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024" width="1em" height="1em" fill="#7F7F7F" class="snsIcon-1D0Pq" alt=""><path d="M80.8 512c0 176.5 106.2 328.2 258.1 394.9-1.2-30.1-0.2-66.2 7.5-99 8.3-35 55.5-234.9 55.5-234.9 0 0-13.8-27.5-13.8-68.3 0-63.9 37-111.6 83.2-111.6 39.2 0 58.2 29.5 58.2 64.8 0 39.4-25.1 98.4-38.1 153-10.8 45.7 22.9 83 68 83 81.7 0 136.7-104.9 136.7-229.2 0-94.5-63.6-165.2-179.4-165.2-130.8 0-212.3 97.5-212.2 206.4 0 37.6 11.1 64.1 28.4 84.6 8 9.4 9.1 13.2 6.2 24-2.1 7.9-6.8 27-8.8 34.6-2.9 10.9-11.7 14.8-21.6 10.8-60.2-24.6-88.3-90.6-88.3-164.7 0-122.5 103.3-269.3 308.2-269.3 164.6 0 273 119.1 272.9 246.9 0 169.1-94 295.5-232.6 295.5-46.5 0-90.3-25.2-105.4-53.7 0 0-25 99.3-30.3 118.5-9.1 33.2-27 66.5-43.4 92.4 38.8 11.4 79.7 17.7 122.2 17.7 238.1 0 431.1-193 431.2-431.2 0-238.1-193.1-431.2-431.2-431.2-238.1 0-431.2 193-431.2 431.2z"></path></svg></a>
      </div>


      <div className={styles.bottom}>
        <p>{t('home.footer.copyRight')}</p>
        <div>
          <span>{t('home.footer.termsOfUse')}</span>
          <span>{t('home.footer.privacyPolicy')}</span>
          <span>{t('home.footer.advertisingChoices')}</span>
          <span>{t('home.footer.yourPrivacyChoices')}</span>
        </div>
      </div>
    </div>
  )
}


export default Home;
