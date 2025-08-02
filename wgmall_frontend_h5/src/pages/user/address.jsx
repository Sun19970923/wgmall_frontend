/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-07-21 22:25:36
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { Form, Input, Button, Toast } from 'antd-mobile'
import styles from './address.module.less'
import { create, getAddress, updataAddress } from '@/api/user'
import { useNavigate } from "react-router-dom";

export default function Message() {
  const [msgList, setMsgList] = useState();
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({  })
  const navigate = useNavigate();
  

  const handleRead = (id) => {
    setMsgList(list => list.map(msg => msg.id === id ? { ...msg, unread: false } : msg));
  };

  const getData = async () => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))

    const res = await getAddress({ userId: userinfo.id })
    
    if(res.data.address){
      console.log(res.data.address, 'res.data.address');
      
      return setInitialValues(res.data.address)
    }
    setInitialValues({ id: 1 })
  }


  const postAddress = async (values) => {
    let userinfo = JSON.parse(localStorage.getItem('userInfo'))


    const data = {
      ...values,
      id: userinfo.id
    }


    if(initialValues.city){
      const res = await updataAddress(data)
      if(res.data){
        Toast.show({
          icon: 'success',
          content: '更新成功'
        })
        
      }
      return
    }
    



    const res = await create(data)


    if(res.data){
      Toast.show({
        icon: 'success',
        content: '提交成功'
      })
      
    }
  }


  const onFinish = (values) => {
    console.log(values);
  
    postAddress(values)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }} className={styles.address}>
        <NavBar title={'地址'} style={{ height: '100px' }}></NavBar>
        {
          initialValues.id &&
          <Form 
            layout='horizontal'
            onFinish={onFinish}
            initialValues={initialValues}
            mode='card'
            footer={
              <Button block type='submit'  color='primary' size='large'>
                提交
              </Button>
            }
          >
              <Form.Item required name="province" label='province'>
                <Input placeholder='Please input' />
              </Form.Item>
              <Form.Item required name="city"  label='city'>
                <Input placeholder='Please input' />
              </Form.Item>

              
              <Form.Item required name="district" label='district'>
                <Input placeholder='Please input' />
              </Form.Item>
              <Form.Item required name="street" label='street'>
                <Input placeholder='Please input' />
              </Form.Item>
              <Form.Item required name="detail" label='detail'>
                <Input placeholder='Please input' />
              </Form.Item>
              <Form.Item  required name="country" label='country'>
                <Input placeholder='Please input' />
              </Form.Item>
              <Form.Item required name="receiverName" label='receiverName'>
                <Input placeholder='Please input' />
              </Form.Item>
              <Form.Item required name="receiverPhone" label='receiverPhone'>
                <Input placeholder='Please input' />
              </Form.Item>
            <Form.Header />
          </Form>
        }
    </div>
  );
} 