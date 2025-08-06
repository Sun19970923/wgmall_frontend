import React, { useState } from 'react';
import { MessageOutline, FileOutline, GiftOutline } from 'antd-mobile-icons';
import NavBar from "../../components/NavBar";
import { Form, Input, Button, Toast, Radio, Space, ImageUploader } from 'antd-mobile';
import styles from './apply.module.less';
import { apply } from '@/api/user';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

const tabItems = [
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
];

export default function Apply() {
    const { t } = useTranslation(); // 使用 t 函数来获取翻译文本
    const [msgList, setMsgList] = useState();
    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState({});
    const navigate = useNavigate();
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);
    const [checkBanner, setCheckBanner] = useState(false);

    const mockUpload = (file) => {
        console.log(file);
        return {
            url: URL.createObjectURL(file),
            file: file
        };
    };

    const mockUpload2 = (file) => {
        console.log(file);
        return {
            url: URL.createObjectURL(file),
            file: file
        };
    };

    const postAddress = async (values) => {
        console.log(values, 'values');
        console.log(fileList, 'fileList');

        if (!values.shopName || !values.shopDescription || !values.productType || !values.job || !values.monthlyIncome || !values.idFrontImage || !values.idBackImage || !values.businessPhone) {
            Toast.show({
                icon: 'fail',
                content: t('apply.fillComplete') // 使用翻译
            });
            return;
        }

        // 创建一个 FormData 实例
        const formData = new FormData();

        // 遍历对象，将键值对添加到 FormData 实例中
        Object.keys(values).forEach(key => {
            if (key === 'idFrontImage' || key === 'idBackImage') {
                formData.append(key, values[key][0]?.file);
                return;
            }
            formData.append(key, values[key]);
        });

        const res = await apply(formData);

        if (res.code === 200) {
            Toast.show({
                icon: 'success',
                content: res.message
            });

            setTimeout(() => {
                navigate('/home');
            }, 2000);
            return;
        }

        Toast.show({
            icon: 'fail',
            content: res.message
        });
    };

    const onFinish = (values) => {
        console.log(values);
        postAddress(values);
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #e3e8ee 100%)', padding: '0 0 32px 0' }} className={styles.address}>
            <NavBar title={t('apply.temuShop')} style={{ height: '100px' }}></NavBar>  {/* 使用翻译 */}

            {
                !checkBanner ?
                    <div className={styles.banner} onClick={() => setCheckBanner(true)}>
                        <img src={require('@/assets/banner3.png')} alt="" />
                        <div className={styles.button}>
                            {t('apply.applyButton')}  {/* 使用翻译 */}
                        </div>
                    </div>
                    :
                    <Form
                        layout='horizontal'
                        onFinish={onFinish}
                        initialValues={initialValues}
                        mode='card'
                        footer={
                            <Button block type='submit' color='primary' size='large'>
                                {t('apply.submit')}  {/* 使用翻译 */}
                            </Button>
                        }
                    >
                        <Form.Item required name="shopName" label={t('apply.shopName')}>
                            <Input placeholder={t('apply.enterShopName')} />
                        </Form.Item>
                        <Form.Item required name="shopDescription" label={t('apply.shopDescription')}>
                            <Input placeholder={t('apply.enterShopDescription')} />
                        </Form.Item>

                        <Form.Item required name="businessPhone" label={t('apply.businessPhone')}>
                            <Input
                                placeholder={t('apply.enterBusinessPhone')}
                                type="number" // 只允许数字输入
                                min="0"       // 可选：确保输入为正数
                                step="1"      // 可选：确保输入为整数
                            />
                        </Form.Item>
                        <Form.Item required name="job" label={t('apply.job')}>
                            <Input placeholder={t('apply.enterJob')} />
                        </Form.Item>
                        <Form.Item required name="productType" label={t('apply.productType')}>
                            <Radio.Group>
                                <Space direction='vertical'>
                                    {tabItems.map(item => <Radio key={item.key} value={item.key}>{item.title}</Radio>)}
                                </Space>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item required name="monthlyIncome" label={t('apply.monthlyIncome')}>
                            <Input
                                placeholder={t('apply.enterMonthlyIncome')}
                                type="number" // 只允许数字输入
                                min="0"       // 可选：确保输入为正数
                                step="1"      // 可选：确保输入为整数
                            />
                        </Form.Item>
                        <Form.Item required name="idFrontImage" label={t('apply.idFrontImage')}>
                            <ImageUploader
                                value={fileList}
                                onChange={setFileList}
                                upload={mockUpload}
                                multiple
                                maxCount={1}
                                showUpload={fileList.length < 1}
                                onCountExceed={exceed => {
                                    Toast.show(`${t('apply.maxSelectImage')} ${1} ${t('apply.youSelectedTooMany')} ${exceed}`);
                                }}
                            />
                        </Form.Item>
                        <Form.Item required name="idBackImage" label={t('apply.idBackImage')}>
                            <ImageUploader
                                value={fileList2}
                                onChange={setFileList2}
                                upload={mockUpload2}
                                multiple
                                maxCount={1}
                                showUpload={fileList2.length < 1}
                                onCountExceed={exceed => {
                                    Toast.show(`${t('apply.maxSelectImage')} ${1} ${t('apply.youSelectedTooMany')} ${exceed}`);
                                }}
                            />
                        </Form.Item>
                    </Form>
            }
        </div>
    );
}
