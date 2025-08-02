/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-31 02:58:07
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { PullToRefresh, Button, Toast, Card, Space, TabBar, Tag, Grid, Mask, List, Tabs, Empty, Ellipsis } from "antd-mobile";
import styles from "./myShop.module.less";
import { formatAmount } from '@/utils/utils'
import { shopHome, userInfo } from '@/api/user';
import { useEffect, useState } from "react";
import { products, removeProduct, editPrice } from '@/api/product';
import NavBar from "../../components/NavBar";
import LoadingMask from '../../components/Loading';
import ShopTabBar from '../../components/ShopTabBar';
import { useNavigate } from 'react-router-dom'
import { fa } from "element-plus/es/locales.mjs";


const ShopHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({}); // data
  const [activeIndex, setActiveIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(0)
  const [shopInfo, setShopInfo] = useState({})
  const [current, setCurrent] = useState({})
  const [msgList, setMsgList] = useState([]);
  

  const getData = async () => {
    // setLoading(true)
    let { id, shopId } = JSON.parse(localStorage.getItem('userInfo'))
    

    let pro = await products(shopId)

    setMsgList(pro.data)

    setLoading(false)
  }


  const downProduct = async (value) => {

    let userInfo = JSON.parse(localStorage.getItem('userInfo'))

    let res = await removeProduct({
        "shopId": userInfo.shopId,
        "productId": value.id
    })

    if(res.code === 200){
        Toast.show({
            icon: 'success',
            content: res.message,
        });
        getData()
    }
  }

  const edit = async (data) => {
    setVisible(true)
    setCurrent(data)

    // let res = await editPrice({
    //     "shopId": userInfo.shopId,
    //     "productId": value.id,
    //     "newPrice": 0
    // })
  }

  const submit = async () => {
    let userInfo = JSON.parse(localStorage.getItem('userInfo'))
    let res = await editPrice({
        "shopId": userInfo.shopId,
        "productId": current.id,
        "newPrice": value
    })

    if(res.code == 200){
        setVisible(false)
        Toast.show({
            icon: 'success',
            content: res.message,
        })
        getData()
    }
  }
  

  useEffect(() => {
    getData()
  }, [])



  return (
    <div className={styles.indexContainer}>
      <LoadingMask visible={loading} />


      <Mask visible={visible} onMaskClick={() => setVisible(false)}>
            <div className={styles.overlayContent}>
                <Card>
                    <h1>上架商品</h1>

                    <br />
                    <br />
                    
                    <div className={styles.content}>
                        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="修改商品价格" />
                        
                        <br />

                        <div className={styles.button} onClick={() => submit()}>Submit</div>
                    </div>
                </Card>
            </div>
      </Mask>


      <div className={styles.indexBody}>
        <NavBar title={'我的店铺'}></NavBar>
        

        {
          msgList.length > 0 ?
          <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
            {msgList.map(msg => (
              <List.Item
                key={msg.id}
                description={<span style={{ color: '#666', fontSize: 14 }}>{msg.content}</span>}
                extra={<span style={{ color: '#aaa', fontSize: 13 }}>{msg.time}</span>}
                style={{
                  fontWeight: msg.unread ? 700 : 400,
                  background: msg.unread ? 'linear-gradient(90deg, #f5f7fa 0%, #fff 100%)' : '#fff',
                  borderRadius: 8,
                  margin: '8px 16px',
                  boxShadow: msg.unread ? '0 2px 8px rgba(60,80,120,0.06)' : 'none',
                }}
              >
                <div style={{ height: '120px', display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ width: '40%', height: '100%' }}>
                    <img src={baseApi + msg.imagePath} style={{ width: '100%', height: '100%', borderRadius: 8 }} />
                  </div>

                  <div style={{ width: '58%', padding: '10px 0' }}>
                    {
                      msg?.name &&
                      <Ellipsis direction='end' content={msg?.name} rows={2} style={{ fontSize: '18px'}}/>
                    }
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <p style={{ color: '#fb7701',fontSize: '18px' }}>${formatAmount(msg?.price || 0)}  </p>
                      <div>
                        <button onClick={(e) => {
                            edit(msg)
                        }} style={{ color: '#fff', background: '#fb7701' , padding: '4px 8px' , border: 'none', fontSize: '14px', borderRadius: '8px' }}>编辑</button>
                        &nbsp; &nbsp;
                        <button onClick={(e) => {
                            downProduct(msg)
                        }} style={{ color: '#fff', background: '#fb7701' , padding: '4px 8px' , border: 'none', fontSize: '14px', borderRadius: '8px' }}>下架</button>
                      </div>
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
          :
          <Empty
            style={{ padding: '64px 0' }}
            imageStyle={{ width: 128 }}
            description='暂无数据'
          />
        }

      </div>

      <br />
    
      <br />

    </div>
  );
};


export default ShopHome;
