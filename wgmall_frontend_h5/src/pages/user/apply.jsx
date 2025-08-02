/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-02 00:38:53
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { Form, Input, Button, Toast, Radio, Space, ImageUploader } from 'antd-mobile'
import styles from './apply.module.less'
import { apply } from '@/api/user'
import { useNavigate } from "react-router-dom";


const tabItems = [
    { key: 'All', title: 'All' },
    { key: 'WOMEN', title: 'Women' },
    { key: 'HOME_GOODS', title: 'Family' },
    { key: 'MENS', title: 'Men' },
    { key: 'SPORTS', title: 'Sports' },
    { key: 'INDUSTRIAL_GOODS', title: 'Industrial' },
    { key: 'CRAFTS', title: 'Crafts' },
    { key: 'JEWELRY', title: 'Jewelry' },
    { key: 'TOYS', title: 'Toy' },
    { key: 'ELECTRONICS', title: 'Electronics' },
    { key: 'GARDEN', title: 'Garden' },
    { key: 'OFFICE_SUPPLIES', title: 'Office' },
    { key: 'BAGS', title: 'Bag' },
    { key: 'CHILDREN', title: 'Children' },
    { key: 'BEAUTY', title: 'Beauty' },
    { key: 'HEALTH', title: 'Health' },
    { key: 'PETS', title: 'Pet' },
    { key: 'APPLIANCES', title: 'Appliances' },
    { key: 'FOOD', title: 'Food' },
]



export default function Apply() {
  const [msgList, setMsgList] = useState();
  const [form] = Form.useForm()
  const [initialValues, setInitialValues] = useState({  })
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([])
  const [fileList2, setFileList2] = useState([])
  const [checkBanner, setCheckBanner] = useState(false)


  const mockUpload = (file) => {
    console.log(file);
    return {
        url: URL.createObjectURL(file),
        file: file
    }
    
  }

  
  const mockUpload2 = (file) => {
    console.log(file);
    return {
        url: URL.createObjectURL(file),
        file: file
    }
  }




  const postAddress = async (values) => {
    console.log(values, 'values');
    console.log(fileList, 'fileList');  
    
    if(!values.shopName || !values.shopDescription || !values.productType || !values.job || !values.monthlyIncome || !values.idFrontImage || !values.idFrontImage || !values.businessPhone){
        Toast.show({
            icon: 'fail',
            content: '请填写完整'
        })
        return
    }

    console.log(values);

    // 创建一个 FormData 实例
    const formData = new FormData();

    // 遍历对象，将键值对添加到 FormData 实例中
    Object.keys(values).forEach(key => {
        if(key == 'idFrontImage' || key == 'idBackImage'){
            formData.append(key, values[key][0].file)
            return
        }
        formData.append(key, values[key]);
    });


    const res = await apply(formData)


    if(res.code == 200){
      Toast.show({
        icon: 'success',
        content: res.message
      })

      setTimeout(() => {
        navigate('/home')
      }, 2000);
      return
    }
    Toast.show({
        icon: 'fail',
        content: res.message
    })

  }


  const onFinish = (values) => {
    console.log(values);
  
    postAddress(values)
  }


  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }} className={styles.address}>
        <NavBar title={'开店申请'} style={{ height: '100px' }}></NavBar>
        
        {
            !checkBanner ?
            <div className={styles.banner} onClick={() => setCheckBanner(true)}>
                <img src={require('@/assets/banner3.png')} alt="" />
                <div className={styles.button}>
                    申请开店
                </div>
            </div>
                :
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
                    <Form.Item required name="shopName" label='shopName'>
                        <Input placeholder='Please input' />
                    </Form.Item>
                    <Form.Item required name="shopDescription"  label='shopDescription'>
                        <Input placeholder='Please input' />
                    </Form.Item>

                    
                    <Form.Item required name="businessPhone" label='businessPhone'>
                        <Input placeholder='Please input' />
                    </Form.Item>
                    <Form.Item required name="job" label='job'>
                        <Input placeholder='Please input' />
                    </Form.Item>
                    <Form.Item required name="productType" label='productType'>
                    <Radio.Group>
                        <Space direction='vertical'>
                            {
                                tabItems.map(item => <Radio key={item.key} value={item.key}>{item.title}</Radio >) 
                            }
                        </Space>
                    </Radio.Group>
                    </Form.Item>
                    <Form.Item  required name="monthlyIncome" label='monthlyIncome'>
                        <Input placeholder='Please input' />
                    </Form.Item>
                    <Form.Item required name="idFrontImage" label='idFrontImage'>
                        <ImageUploader
                            value={fileList}
                            onChange={setFileList}
                            upload={mockUpload}
                            multiple
                            maxCount={1}
                            showUpload={fileList.length < 1}
                            onCountExceed={exceed => {
                                Toast.show(`最多选择 ${1} 张图片，你多选了 ${exceed} 张`)
                            }}
                        />
                    </Form.Item>
                    <Form.Item required name="idBackImage" label='idBackImage'>
                        <ImageUploader
                            value={fileList2}
                            onChange={setFileList2}
                            upload={mockUpload2}
                            multiple
                            maxCount={1}
                            showUpload={fileList2.length < 1}
                            onCountExceed={exceed => {
                                Toast.show(`最多选择 ${1} 张图片，你多选了 ${exceed} 张`)
                            }}
                        />
                    </Form.Item>
                <Form.Header />
            </Form>
        }
    </div>
  );
} 