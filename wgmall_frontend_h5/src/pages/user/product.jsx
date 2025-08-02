/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-30 03:31:11
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useMemo, useState } from 'react';
import { List, Slider, InfiniteScroll, Empty, Ellipsis, Mask , Card, Toast } from 'antd-mobile';
import { MessageOutline, FileOutline, QuestionCircleOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { message } from "@/api/user"
import { availableProducts, listProduct, priceRange } from "@/api/product"
import { useNavigate } from 'react-router-dom'
import styles from './product.module.less'
import { splitNumberByProgress } from '@/utils/utils';
import Marks from 'antd-mobile/es/components/slider/marks';


export default function Message() {
  const [msgList, setMsgList] = useState([]);
  const [hasMore, setHasMore] = useState(true)
  const [current, setCurrent] = useState({page: 0})
  const navigate = useNavigate()
  const [visible, setVisible] = useState(0); // data
  const [marks, setMarks] = useState(null); // data
  const [number, setNumber] = useState(0); // data
  const [productId, setProductId] = useState(0); // data


  const loadMore = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    console.log(userinfo);
    
    let res = await availableProducts({ shopId: userinfo.shopId, page: current.page, size: 10 })

    setHasMore(false)

    setMsgList(res.data)

    // const append = await mockRequest()
    // setHasMore(append.length > 0)
  }


  const upProduct = async (value) => {

    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    setProductId(value.id)

    let res = await priceRange({ shopId: userinfo.shopId, productId: value.id })

    setMarks(splitNumberByProgress(res.data.minPrice, res.data.maxPrice, 5))

    setVisible(true)
  }


  const handleRead = (item) => {
    localStorage.setItem('item', JSON.stringify(item))
    navigate('/details')
  };


  const toastValue = (value) => {
    console.log(value, 'value');
    setNumber(value)
    let text = ''
    if (typeof value === 'number') {
      text = `${value}`
    } else {
      text = `${value.join('--')}`
    }
    Toast.show(`当前选中值为：${text}`)
  }

  const realPrice = useMemo(() => {
     if(marks){
        return marks[number]
     }

  }, [number, marks])


  const submit = async () => {
      setMarks(null)
      let userinfo = JSON.parse(localStorage.getItem('userInfo'))
      
      let res = await listProduct({
        "shopId": userinfo.shopId,
        "productId": productId,
        "chosenPrice": realPrice
      })

      if(res.code === 200){
        Toast.show({
            icon: 'success',
            content: res.message,
        })
        setVisible(false)
      }
  }


  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }}>
        <NavBar title={'商品'} style={{ height: '100px' }}></NavBar>

        <Mask visible={visible} onMaskClick={() => setVisible(false)}>
            <div className={styles.overlayContent}>
                <Card>
                    <h1>上架商品</h1>

                    <br />
                    <br />
                    
                    <div className={styles.content}>
                        {
                            marks && 
                            <Slider
                                marks={marks}
                                ticks
                                onAfterChange={toastValue}
                                onChange={value => {
                                    console.log(value)
                                }}
                            />
                        }
                        
                        <br />
                        <br />
                        <br />

                        <div className={styles.button} onClick={() => submit()}>Submit</div>
                    </div>
                </Card>
                </div>
        </Mask>


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
                      <p style={{ color: '#fb7701',fontSize: '18px' }}>$ {msg?.costPrice} <del style={{ color: '#333', fontSize: '12px' }}>{msg?.price}</del> </p>
                      <button onClick={(e) => {
                        upProduct(msg)
                      }} style={{ color: '#fff', background: '#fb7701' , padding: '4px 8px' , border: 'none', fontSize: '14px', borderRadius: '8px' }}>上架</button>
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
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
    </div>
  );
} 