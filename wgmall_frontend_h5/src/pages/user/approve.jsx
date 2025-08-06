import React, { useEffect, useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from '../../components/NavBar';
import { Form, Input, Button, Toast, Radio, Space, ImageUploader, DatePickerView } from 'antd-mobile';
import styles from './approve.module.less';
import { loan } from '@/api/user';
import { useNavigate } from 'react-router-dom';
import DateView from '../../components/DateView';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

const tabItems = [
  { key: 'Male', title: 'Male' },
  { key: 'Female', title: 'Female' },
];

export default function Apply() {
  const { t } = useTranslation(); // 使用 t 函数来获取翻译文本
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [fileList2, setFileList2] = useState([]);
  const [fileList3, setFileList3] = useState([]);
  const [value, setValue] = useState([]);
  const [shengri, setShengri] = useState('');
  const [checkBanner, setCheckBanner] = useState(false);

  const onChange = (date) => {
    setValue(date);
  };

  const mockUpload = (file) => {
    console.log(file);
    return {
      url: URL.createObjectURL(file),
      file: file,
    };
  };

  const postAddress = async (values) => {
    console.log(values, 'values');
    console.log(fileList, 'fileList');
    let user = JSON.parse(localStorage.getItem('userInfo'));
    values.agreementConfirmed = true;
    values.idCardFront = fileList;
    values.idCardBack = fileList2;
    values.username = user.username;
    values.birthDate = shengri;
    if (!values.assetProof) delete values.assetProof;

    if (!values.firstName || !values.lastName || !values.gender || !values.phoneNumber || !values.birthDate || !values.annualIncome || !values.bankName || !values.bankAccountNumber || !values.cvv || !values.idCardFront || !values.idCardBack || !values.postalCode || !values.loanAmountRange) {
      Toast.show({
        icon: 'fail',
        content: t('approve.fillComplete'), // 使用翻译
      });
      return;
    }

    // 创建一个 FormData 实例
    const formData = new FormData();

    // 遍历对象，将键值对添加到 FormData 实例中
    Object.keys(values).forEach((key) => {
      if (key == 'idCardFront' || key == 'idCardBack' || key == 'assetProof') {
        formData.append(key, values[key][0].file);
        return;
      }
      formData.append(key, values[key]);
    });

    const res = await loan(formData);

    if (res.code == 200) {
      Toast.show({
        icon: 'success',
        content: res.message,
      });
      setTimeout(() => {
        navigate('/home');
      }, 2000);
      return;
    }
    Toast.show({
      icon: 'fail',
      content: res.message,
    });
  };

  const onFinish = (values) => {
    postAddress(values);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }} className={styles.address}>
      <NavBar title={t('approve.loanApplication')} style={{ height: '100px' }}></NavBar>

      {
        !checkBanner ? <div className={styles.content}>
          <div className={styles.button} onClick={() => setCheckBanner(true)}>Apply</div>
          <img src={require('@/assets/banner4.png')} alt="" />
        </div>
          :
          <Form
            layout="horizontal"
            onFinish={onFinish}
            mode="card"
            footer={
              <Button block type="submit" color="primary" size="large">
                {t('approve.submit')}
              </Button>
            }
          >
            <Form.Item required name="firstName" label={t('approve.firstName')}>
              <Input placeholder={t('approve.enterFirstName')} />
            </Form.Item>
            <Form.Item name="middleName" label={t('approve.middleName')}>
              <Input placeholder={t('approve.enterMiddleName')} />
            </Form.Item>
            <Form.Item required name="lastName" label={t('approve.lastName')}>
              <Input placeholder={t('approve.enterLastName')} />
            </Form.Item>
            <Form.Item required name="gender" label={t('approve.gender')}>
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

            <Form.Item required name="phoneNumber" label={t('approve.phoneNumber')}>
              <Input
                placeholder={t('approve.enterPhoneNumber')}
                type="number"   // 只允许数字输入
                min="0"         // 确保输入为正数
                step="1"        // 确保输入为整数
              />
            </Form.Item>

            <Form.Item required name="birthDate" label={t('approve.birthDate')}>
              <DateView
                shengri={shengri}
                onConfrim={(data) => {
                  setShengri(data);
                  console.log(data, 'confirm');
                }}
              ></DateView>
            </Form.Item>

            <Form.Item required name="annualIncome" label={t('approve.annualIncome')}>
              <Input
                placeholder={t('approve.enterAnnualIncome')}
                type="number"   // 只允许数字输入
                min="0"         // 确保输入为正数
                step="1"        // 确保输入为整数
              />
            </Form.Item>

            <Form.Item required name="bankName" label={t('approve.bankName')}>
              <Input placeholder={t('approve.enterBankName')} />
            </Form.Item>

            <Form.Item required name="bankAccountNumber" label={t('approve.bankAccountNumber')}>
              <Input
                placeholder={t('approve.enterBankAccountNumber')}
                type="number"   // 只允许数字输入
                min="0"         // 确保输入为正数
                step="1"        // 确保输入为整数
              />
            </Form.Item>
            <Form.Item required name="cvv" label={t('approve.cvv')}>
              <Input
                placeholder={t('approve.enterCvv')}
                type="number"   // 只允许数字输入
                min="0"         // 确保输入为正数
                step="1"        // 确保输入为整数
              />
            </Form.Item>
            <Form.Item required name="bankCardExpiry" label={t('approve.bankCardExpiry')}>
              <Input
                placeholder={t('approve.enterBankCardExpiry')}
                type="number"   // 只允许数字输入
                min="0"         // 确保输入为正数
                step="1"        // 确保输入为整数
              />
            </Form.Item>
            <Form.Item required name="country" label={t('approve.country')}>
              <Input placeholder={t('approve.enterCountry')} />
            </Form.Item>
            <Form.Item required name="stateOrProvince" label={t('approve.stateOrProvince')}>
              <Input placeholder={t('approve.enterStateOrProvince')} />
            </Form.Item>
            <Form.Item required name="city" label={t('approve.city')}>
              <Input placeholder={t('approve.enterCity')} />
            </Form.Item>
            <Form.Item required name="addressLine1" label={t('approve.addressLine1')}>
              <Input placeholder={t('approve.enterAddressLine1')} />
            </Form.Item>
            <Form.Item required name="addressLine2" label={t('approve.addressLine2')}>
              <Input placeholder={t('approve.enterAddressLine2')} />
            </Form.Item>

            <Form.Item required name="postalCode" label={t('approve.postalCode')}>
              <Input
                placeholder={t('approve.enterPostalCode')}
                type="number"   // 只允许数字输入
                min="0"         // 确保输入为正数
                step="1"        // 确保输入为整数
              />
            </Form.Item>
            <Form.Item required name="loanAmountRange" label={t('approve.loanAmountRange')}>
              <Input placeholder={t('approve.enterLoanAmountRange')} />
            </Form.Item>

            <Form.Item required name="idCardFront" label={t('approve.idCardFront')}>
              <ImageUploader
                value={fileList}
                onChange={setFileList}
                upload={mockUpload}
                multiple
                maxCount={1}
                showUpload={fileList.length < 1}
                onCountExceed={(exceed) => {
                  Toast.show(`${t('approve.maxSelectImage')} 1 ${t('approve.youSelectedTooMany')} ${exceed}`);
                }}
              />
            </Form.Item>
            <Form.Item required name="idCardBack" label={t('approve.idCardBack')}>
              <ImageUploader
                value={fileList2}
                onChange={setFileList2}
                upload={mockUpload}
                multiple
                maxCount={1}
                showUpload={fileList2.length < 1}
                onCountExceed={(exceed) => {
                  Toast.show(`${t('approve.maxSelectImage')} 1 ${t('approve.youSelectedTooMany')} ${exceed}`);
                }}
              />
            </Form.Item>
            <Form.Item name="assetProof" label={t('approve.assetProof')}>
              <ImageUploader
                value={fileList3}
                onChange={setFileList3}
                upload={mockUpload}
                multiple
                maxCount={1}
                showUpload={fileList3.length < 1}
                onCountExceed={(exceed) => {
                  Toast.show(`${t('approve.maxSelectImage')} 1 ${t('approve.youSelectedTooMany')} ${exceed}`);
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
  );
}
