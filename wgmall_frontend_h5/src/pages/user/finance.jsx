/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-28 01:48:57
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons'
import NavBar from '../../components/NavBar'
import { Form, Input, Button, Toast, Card, Mask, ImageUploader, DatePickerView } from 'antd-mobile'
import styles from './finance.module.less'
import { info, loanNum, repay } from '@/api/user'
import { useNavigate } from 'react-router-dom'
import { formatAmount } from '@/utils/utils'


export default function Finance() {
  const navigate = useNavigate()
  const [user, setUser] = useState({}); // data
  const [visible, setVisible] = useState(0); // data
  const [type, setType] = useState(0); // data
  const [number, setNumber] = useState(''); // data


  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    setUser(userinfo)

    let res = await info({ userId: userinfo.id })

    if(res.code == 200) setUser(res.data.user)
  }


  const submit = async () => {
     let res = type == 0 ? await loanNum({ userId: user.id, loanAmount: number }) : await repay({ userId: user.id, repayAmount: number })

     if(res.code == 200){
        Toast.show({
            content: res.message,
            icon: 'success'
        })
        setVisible(false)
        setNumber('')
        getData()
     }
  }


  useEffect(() => {
    getData()
  }, [])


  return (
    <div style={{  padding: '0 0 32px 0' }} className={styles.address}>
      <NavBar title={'我的贷款'} style={{ height: '100px' }}></NavBar>

      <Mask visible={visible} onMaskClick={() => setVisible(false)}>
        <div className={styles.overlayContent}>
          <Card>
            <h1>{type == 0 ? '借款' : '还款'}申请</h1>
            
            <div className={styles.content}>
                <input type="number" value={number} onChange={(e) => setNumber(e.target.value)}/>
                <div className={styles.button} onClick={() => submit()}>Submit</div>
            </div>
          </Card>
        </div>
      </Mask>



      <div className={styles.finance}>
            {
                !user.borrowable ?
                <Card>
                    <div className={styles.title}>
                        <span>贷款申请</span>
                    </div>

                    <div className={styles.content}>
                        你的额度是
                    </div>

                    <div className={styles.number}>
                        ?????
                    </div>

                    <div className={styles.button} onClick={() => {
                        navigate('/user/approve')
                    }}>申请贷款</div>

                </Card>
                    :
                <Card>
                    <div className={styles.title}>
                        <span>贷款申请</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div>
                            <div className={styles.content}>
                                你的额度
                            </div>

                            <div className={styles.number}>
                                $ {formatAmount(user.credit || 0)}
                            </div>
                        </div>

                        <div>
                            <div className={styles.content}>
                                你的负债
                            </div>

                            <div className={styles.number}>
                                $ {formatAmount(user.debtAmount || 0)}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around'}}>
                        <div className={styles.button} style={{ background: '#f5f7fa', color: '#000' }} onClick={() => {
                            setType(0)
                            setVisible(true)
                        }}>借款</div>
                        <div className={styles.button} onClick={() => {
                            setVisible(true)
                            setType(1)
                        }}>还款</div>
                    </div>

                </Card>
            }
      </div>

      
      <br />
      <br />
    </div>
  )
}
