import React, { useEffect, useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { Form, Input, Button, Toast } from 'antd-mobile'
import styles from './address.module.less'
import { create, getAddress, updataAddress } from '@/api/user'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // 导入useTranslation

export default function Message() {
  const [msgList, setMsgList] = useState();
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({  })
  const navigate = useNavigate();
  const { t } = useTranslation(); // 使用t函数获取翻译

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
          content: t('address.updateSuccess') // 使用翻译键
        })
      }
      return
    }

    const res = await create(data)

    if(res.data){
      Toast.show({
        icon: 'success',
        content: t('address.submitSuccess') // 使用翻译键
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
        <NavBar title={t('address.title')} style={{ height: '100px' }}></NavBar>
        {
          initialValues.id &&
          <Form 
            layout='horizontal'
            onFinish={onFinish}
            initialValues={initialValues}
            mode='card'
            footer={
              <Button block type='submit' color='primary' size='large'>
                {t('address.submit')} {/* 使用翻译键 */}
              </Button>
            }
          >
              <Form.Item required name="province" label={t('address.province')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>
              <Form.Item required name="city" label={t('address.city')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>

              <Form.Item required name="district" label={t('address.district')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>
              <Form.Item required name="street" label={t('address.street')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>
              <Form.Item required name="detail" label={t('address.detail')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>
              <Form.Item required name="country" label={t('address.country')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>
              <Form.Item required name="receiverName" label={t('address.receiverName')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>
              <Form.Item required name="receiverPhone" label={t('address.receiverPhone')}>
                <Input placeholder={t('address.inputPlaceholder')} />
              </Form.Item>
            <Form.Header />
          </Form>
        }
    </div>
  );
}
