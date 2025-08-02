/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 15:15:36
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-02 00:39:04
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\pages\user\message.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useEffect, useState } from 'react'
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons'
import NavBar from '../../components/NavBar'
import { Form, Input, Button, Toast, Radio, Space, ImageUploader, DatePickerView } from 'antd-mobile'
import styles from './approve.module.less'
import { loan } from '@/api/user'
import { useNavigate } from 'react-router-dom'
import DateView from '../../components/DateView'

const tabItems = [
  { key: 'Male', title: 'Male' },
  { key: 'Female', title: 'Female' },
]

export default function Apply() {
  const navigate = useNavigate()
  const [fileList, setFileList] = useState([])
  const [fileList2, setFileList2] = useState([])
  const [fileList3, setFileList3] = useState([])
  const [value, setValue] = useState([])
  const [shengri, setShengri] = useState('')
  const [checkBanner, setCheckBanner] = useState(false)

  const onChange = (date) => {
    setValue(date)
  }

  const mockUpload = (file) => {
    console.log(file)
    return {
      url: URL.createObjectURL(file),
      file: file,
    }
  }

  const postAddress = async (values) => {
    console.log(values, 'values')
    console.log(fileList, 'fileList')
    let user = JSON.parse(localStorage.getItem('userInfo'))
    values.agreementConfirmed = true
    values.idCardFront = fileList
    values.idCardBack = fileList2
    values.username = user.username
    values.birthDate = shengri
    if (!values.assetProof) delete values.assetProof

    if (!values.firstName || !values.middleName || !values.lastName || !values.gender || !values.phoneNumber || !values.birthDate || !values.annualIncome || !values.bankName || !values.bankAccountNumber || !values.cvv || !values.idCardFront || !values.idCardBack || !values.postalCode || !values.loanAmountRange) {
      Toast.show({
        icon: 'fail',
        content: '请填写完整',
      })
      return
    }

    // 创建一个 FormData 实例
    const formData = new FormData()

    // 遍历对象，将键值对添加到 FormData 实例中
    Object.keys(values).forEach((key) => {
      if (key == 'idCardFront' || key == 'idCardBack' || key == 'assetProof') {
        formData.append(key, values[key][0].file)
        return
      }
      formData.append(key, values[key])
    })

    const res = await loan(formData)

    if (res.code == 200) {
      Toast.show({
        icon: 'success',
        content: res.message,
      })
      setTimeout(() => {
        navigate('/home')
      }, 2000);
      return
    }
    Toast.show({
      icon: 'fail',
      content: res.message,
    })
  }

  const onFinish = (values) => {
    postAddress(values)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }} className={styles.address}>


      <NavBar title={'贷款申请'} style={{ height: '100px' }}></NavBar>

      {
        !checkBanner ? <div className={styles.content}>
            <div className={styles.button} onClick={() => setCheckBanner(true)}>立即申请</div>
            <img src={require('@/assets/banner4.png')} alt="" />
        </div>
        :
        <Form
            layout="horizontal"
            onFinish={onFinish}
            mode="card"
            footer={
            <Button block type="submit" color="primary" size="large">
                Submit
            </Button>
            }
        >
            <Form.Item required name="firstName" label="firstName">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="middleName" label="middleName">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="lastName" label="lastName">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="gender" label="gender">
            <Radio.Group>
                <Space direction="vertical">
                {tabItems.map((item) => (
                    <Radio key={item.key} value={item.key}>
                    {item.title}
                    </Radio>
                ))}
                </Space>
            </Radio.Group>
            </Form.Item>
            <Form.Item required name="phoneNumber" label="phoneNumber">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="birthDate" label="birthDate">
            <DateView
                shengri={shengri}
                onConfrim={(data) => {
                setShengri(data)
                console.log(data, 'confirm')
                }}
            ></DateView>
            </Form.Item>

            <Form.Item required name="annualIncome" label="annualIncome">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="bankName" label="bankName">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="bankAccountNumber" label="bankAccountNumber">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="cvv" label="last three">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="bankCardExpiry" label="bankCardExpiry">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="country" label="country">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="stateOrProvince" label="stateOrProvince">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="city" label="city">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="addressLine1" label="addressLine1">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="addressLine2" label="Apt,Unit">
            <Input placeholder="Please input" />
            </Form.Item>

            <Form.Item required name="postalCode" label="postalCode">
            <Input placeholder="Please input" />
            </Form.Item>
            <Form.Item required name="loanAmountRange" label="loanAmountRange">
            <Input placeholder="Please input" />
            </Form.Item>

            <Form.Item required name="idCardFront" label="idCardFront">
            <p>tips：如果是护照，那就把护照封面页拍下来</p>
            <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={mockUpload}
                multiple
                maxCount={1}
                showUpload={fileList.length < 1}
                onCountExceed={(exceed) => {
                Toast.show(`Max 1`)
                }}
            />
            </Form.Item>
            <Form.Item required name="idCardBack" label="idCardBack">
            <p>tips：如果是护照，那就把护照封面页拍下来</p>
            <ImageUploader
                value={fileList2}
                onChange={setFileList2}
                upload={mockUpload}
                multiple
                maxCount={1}
                showUpload={fileList2.length < 1}
                onCountExceed={(exceed) => {
                Toast.show(`Max 1`)
                }}
            />
            </Form.Item>
            <Form.Item name="assetProof" label="assetProof">
            <ImageUploader
                value={fileList3}
                onChange={setFileList3}
                upload={mockUpload}
                multiple
                maxCount={1}
                showUpload={fileList3.length < 1}
                onCountExceed={(exceed) => {
                Toast.show(`Max 1`)
                }}
            />
            </Form.Item>
            <br />
            <br />
            <br />
            <Form.Header />
        </Form>
      }
  
    </div>
  )
}
