/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-13 22:09:08
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 06:29:37
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\order\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useNavigate } from 'react-router-dom'
import styles from './withdraw.module.less'
import { formatAmount } from '@/utils/utils'
import NavBar from '../../components/NavBar'
import { useEffect } from 'react'
import { useState } from 'react'
import { List, Card, Mask, Toast } from 'antd-mobile'
import { withdrawalETHHistory, withdrawalTronHistory, ethSet, tronSet, withdrawalUser } from '@/api/user'

// 真实支付方式logo图片（可替换为本地或CDN图片地址）
const paymentMethods = [
  {
    key: 'Erc20',
    label: 'ETH',
    img: require('@/assets/icon/eth.png'),
  },
  {
    key: 'Trc20',
    label: 'TRON',
    img: require('@/assets/icon/tron.png'),
  },
]



// 真实支付方式logo图片（可替换为本地或CDN图片地址）
const paymentMethods2 = [
  {
    key: 'wire',
    label: 'Wire Transfer',
    img: require('@/assets/icon/wiretransfer.jpg'),
  },
  {
    key: 'ach',
    label: 'ACH Transfer',
    img: require('@/assets/icon/ACH-Image.jpeg'),
  },
  {
    key: 'google',
    label: 'Google Pay',
    img: require('@/assets/icon/GooglePay_Lockup.width-1300.png'),
  },
  {
    key: 'apple',
    label: 'Apple Pay',
    img: require('@/assets/icon/images.png'),
  },
  {
    key: 'paypal',
    label: 'Paypal',
    img: require('@/assets/icon/GooglePay_Lockup.width-1300.png'),
  },
  {
    key: 'P2P',
    label: 'P2P',
    img: require('@/assets/icon/crypto.jpg'),
  },
  {
    key: 'zelle',
    label: 'Zelle',
    img: require('@/assets/icon/images22.png'),
  },
  {
    key: 'wise',
    label: 'Wise',
    img: require('@/assets/icon/wise-product-logo-1024x1024-1.jpg'),
  },
];


const User = () => {
  const navigate = useNavigate()

  const [user, setUser] = useState({})
  const [eth, setETH] = useState('')
  const [visible, setVisible] = useState(false)
  const [number, setNumber] = useState('')
  const [type, setType] = useState(0)
  const [tron, setTron] = useState('')
  const [address, setAddress] = useState(true)
  const [amount, setAmount] = useState('')
  const [password, setPassword] = useState('')
  const [method, setMethod] = useState('')
  const [payment, setPayment] = useState(false)

  const goOrder = () => {
    navigate('/order/rechargeP2P')
  }

  // 选择支付方式
  const handleSelect = (key) => {
    console.log(key, 'key')
    if (key === 'Erc20') {
      setMethod({
        method: key,
        address: eth,
      })
    }
    if (key === 'Trc20') {
      setMethod({
        method: key,
        address: tron,
      })
    }
    setAddress(false)
    setVisible(true)
  }

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    let res = await withdrawalETHHistory({ userId: userinfo.id })

    console.log(res, 'res')
    if (res.code == 200) {
      setETH(res.data || '')
    }
  }

  const getTron = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    let res = await withdrawalTronHistory({ userId: userinfo.id })

    console.log(res, 'res')
    if (res.code == 200) {
      setTron(res.data || '')
    }
  }

  const withdrawal = async () => {
    let res = await withdrawalUser({
      username: user.username,
      amount: amount,
      fundPassword: password,
      method: method.method,
      address: method.address,
    })

    if (res.code == 200) {
      Toast.show({
        icon: 'success',
        content: res.message,
      })
      setTimeout(() => {
        navigate(-1)
      }, 2000)
    }
  }

  const clikcHandle = (type = 0) => {
    setAddress(true)
    setType(type)
    setNumber('')
    if (type == 0) {
      setNumber(eth)
      setVisible(true)
    }
    if (type == 1) {
      setNumber(tron)
      setVisible(true)
    }
  }

  const tixian = () => {
    if (!amount) {
      Toast.show({
        icon: 'fail',
        content: '请输入提现数量',
      })
      return
    }

    if (!password) {
      Toast.show({
        icon: 'fail',
        content: '请输入资金密码',
      })
      return
    }

    withdrawal()
  }

  const submit = async () => {
    if (type == 0) {
      let res = await ethSet({ userId: user.id, address: number })
      if (res.code == 200) {
        setVisible(false)
        Toast.show({
          icon: 'success',
          content: res.message,
        })
        getData()
      }
    }

    if (type == 1) {
      let res = await tronSet({ userId: user.id, address: number })
      if (res.code == 200) {
        setVisible(false)
        Toast.show({
          icon: 'success',
          content: res.message,
        })
        getTron()
      }
    }
  }


  // 选择支付方式
  const handleSelect2 = (key) => {
    if (key === 'P2P') {
      setPayment(true)
    } else {
      Toast.show({
        icon: 'fail',
        content: '你的地区因为税务问题不支持',
      });
    }
  };

  useEffect(() => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))
    console.log(userinfo, 'userinfo')
    setUser(userinfo)

    getData()
    getTron()
  }, [])

  return (
    <div className={styles.indexContainer}>
      <NavBar title={'提现'} style={{ height: '100px' }}></NavBar>

      <Mask visible={visible} onMaskClick={() => setVisible(false)}>
        <div className={styles.overlayContent}>
          {address ? (
            <Card>
              <h1>wallect address</h1>

              <div className={styles.content}>
                <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                <div className={styles.button} onClick={() => submit()}>
                  Submit
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <h1>提现</h1>

              <div className={styles.content}>
                <span>你的余额：{user.fakeBalance}</span>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="清输入你的提现数量" />
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="清输入资金密码" />
                <div className={styles.button} onClick={() => tixian()}>
                  Submit
                </div>
              </div>
            </Card>
          )}
        </div>
      </Mask>

      <div className={styles.indexBody}>
        <div style={{ padding: '32px 0' }}>
          {
            !payment ? 
            <Card
              style={{
                maxWidth: 400,
                margin: '0 auto',
                borderRadius: 18,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}
              bodyStyle={{ padding: '28px 0 8px 0' }}
            >
              <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 18, color: '#232526', letterSpacing: 2 }}>选择提现方式</div>
              <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                {paymentMethods2.map((item) => (
                  <List.Item
                    key={item.key}
                    prefix={<img src={item.img} alt={item.label} style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 2 }} />}
                    onClick={() => handleSelect2(item.key)}
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: '#232526',
                      borderRadius: 12,
                      margin: '8px 16px',
                      background: '#f8fafc',
                      boxShadow: '0 1px 4px rgba(191,161,74,0.04)',
                    }}
                    arrow={false}
                  >
                    {item.label}
                  </List.Item>
                ))}
              </List>
            </Card>
            :
            <Card
              style={{
                maxWidth: 400,
                margin: '0 auto',
                borderRadius: 18,
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              }}
              bodyStyle={{ padding: '28px 0 8px 0' }}
            >
              <div style={{ textAlign: 'center', fontSize: 22, fontWeight: 700, marginBottom: 18, color: '#232526', letterSpacing: 2 }}>选择提现方式</div>
              <List style={{ '--border-top': 'none', '--border-bottom': 'none' }}>
                {paymentMethods.map((item, index) => (
                  <List.Item
                    key={item.key}
                    prefix={<img src={item.img} alt={item.label} style={{ width: 32, height: 32, objectFit: 'contain', borderRadius: 6, background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: 2 }} />}
                    onClick={() => handleSelect(item.key)}
                    style={{
                      fontSize: 18,
                      fontWeight: 500,
                      color: '#232526',
                      borderRadius: 12,
                      margin: '8px 16px',
                      background: '#f8fafc',
                      boxShadow: '0 1px 4px rgba(191,161,74,0.04)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                    arrow={false}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{item.label}</span>
                      <span
                        style={{ color: 'blue', fontSize: '16px' }}
                        onClick={(event) => {
                          event.stopPropagation()
                          clikcHandle(index)
                        }}
                      >
                        {'设置地址'}
                      </span>
                    </div>
                  </List.Item>
                ))}
              </List>
            </Card>
          }

        </div>
      </div>
    </div>
  )
}

export default User
