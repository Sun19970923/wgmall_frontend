import { Form, Input, Button } from 'antd';
import { Toast } from 'antd-mobile';
import { useEffect, useState } from "react";
import { getCaptcha, getCaptchaMock, register, login } from "@/api/user.js";
import { useNavigate } from "react-router-dom";
import styles from "@/assets/css/login.less";
import logo from "../assets/logo.webp";
import iogin1 from "../assets/login_1.webp";
import iogin2 from "../assets/login_2.webp";
import LoadingMask from '../components/Loading';
import { useTranslation } from 'react-i18next';

export default function OrderLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const getCaptchaFunc = () => {
    getCaptcha();
    getCaptchaMock();
  };

  const onFinish = async (values) => {
    if (isLogin) {
      if (!values.username || !values.password) {
        return Toast.show({
          icon: 'fail',
          content: t('login.content'),
        });
      }
    } else {
      if (!values.password || !values.fundpassword || !values.username || !values.phone || !values.invitecode) {
        return Toast.show({
          icon: 'fail',
          content: t('login.content'),
        });
      }
    }

    setLoading(true);

    if (!isLogin) {
      fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => handleLoginOrRegister({ ...values, ip: data.ip }))
        .catch(error => {
          Toast.show({ icon: 'fail', content: error });
          setLoading(false);
        });
      return;
    }

    handleLoginOrRegister({ ...values });
  };

  const handleLoginOrRegister = async (formData) => {
    let loginData = {
      username_or_phone: formData.username,
      password: formData.password,
    };

    let res = isLogin ? await login(loginData) : await register(formData);
    setLoading(false);

    if (res.code === 200) {
      Toast.show({ icon: 'success', content: res.message });

      setTimeout(() => {
        navigate('/order'); // 
      }, 1500);
    }
  };

  useEffect(() => {
    // 清除缓存的 token 和用户信息
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('username');
  }, []);

  return (
    <>
      <LoadingMask visible={loading} />

      <div className={styles.header}>
        <div className={styles.logoChunk}>
          <img src={logo} alt="" />
          <span>HK</span>
        </div>
        <div className={styles.tips}>
          {t('login.cyptro')}
        </div>
        <Button onClick={() => navigate('/LanguageSwitchPage')} className={styles.Language}>
          {t('login.language')}
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.icons}>
          <div className={styles.icon_item}>
            <img src={iogin1} alt="" />
            <span>{t('login.nofee')}</span>
            <span>{t('login.saleoff')}</span>
          </div>
          <div className={styles.icon_item}>
            <img src={iogin2} alt="" />
            <span>{t('login.refund')}</span>
            <span>{t('login.nintyday')}</span>
          </div>
        </div>

        <div className={styles.from}>
          <Form layout="horizontal" onFinish={onFinish}>
            <Form.Item label={t('login.username')} name="username">
              <Input placeholder={t('login.username')} />
            </Form.Item>
            <Form.Item label={t('login.password')} name="password">
              <Input placeholder={t('login.password')} type="password" />
            </Form.Item>

            {!isLogin && (
              <>
                <Form.Item label={t('login.phone')} name="phone">
                  <Input placeholder={t('login.phone')} />
                </Form.Item>
                <Form.Item label={t('login.fundpassword')} name="fundpassword">
                  <Input placeholder={t('login.fundpassword')} type="password" />
                </Form.Item>
                <Form.Item label={t('login.invitecode')} name="invitecode">
                  <Input placeholder={t('login.invitecode')} />
                </Form.Item>
              </>
            )}

            <br /><br />
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submit}>
                {isLogin ? t('login.submit') : t('login.register')}
              </Button>
            </Form.Item>

            <span className={styles.switch} onClick={() => setIsLogin(!isLogin)}>
              {t(isLogin ? 'login.register' : 'login.gologin')}
            </span>
          </Form>
        </div>
      </div>
    </>
  );
}
