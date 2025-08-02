/*
 * @Author: Evan 360313191@qq.com
 * @Date: 2025-07-09 12:55:39
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-02 00:43:07
 * @FilePath: \wgmall\wgmall_frontend_h5\src\pages\login.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Form, Input, Button, Card } from 'antd';
import { Toast } from 'antd-mobile';
import { useEffect, useState } from "react";
import { getCaptcha, getCaptchaMock } from "@/api/user.js";
import { useNavigate } from "react-router-dom";
import styles from "@/assets/css/login.less";
import logo from "../assets/logo.webp";
import iogin1 from "../assets/login_1.webp";
import iogin2 from "../assets/login_2.webp";
import { register, getIP, login } from '@/api/user';
import { showLoading, hideLoading } from '@/utils/loading';
import { useLocation } from 'umi';
import LoadingMask from '../components/Loading';


export default function LoginPage() {
  const getCaptchaFunc = () => {
    getCaptcha();
    getCaptchaMock();
  };
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirect = queryParams.get('redirect');


  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log(isLogin, 'isLogin');
    
    console.log('Form values:', values);

    if(isLogin){
      if(!values.username || !values.password){
        return Toast.show({
          icon: 'fail',
          content: '请填写完整',
        })
      }
    }else{
      if(!values.password || !values.fundpassword || !values.username || !values.phone || !values.invitecode){
        return Toast.show({
          icon: 'fail',
          content: '请填写完整',
        })
      }
    }


    setLoading(true)

    
    // let registerData = {
    //   "username": "abc",
    //   "phone": "1306701111",
    //   "password": "123456",
    //   "invitecode": "dasdas",
    //   "fundpassword": "112121",
    //   "ip": "112.1.121.1"
    // }

    // showLoading()
    
    if(!isLogin){
      fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => getLogin({ ...values, ip: data.ip }))
      .catch(error => {
        Toast.show({
          icon: 'fail',
          content: error,
        })
        setLoading(false)
      });
      return
    }

    getLogin({ ...values })
  };



  const getLogin = async (registerData) => {

    let loginData = {
      username_or_phone: registerData.username,
      password: registerData.password,
    }

    let res = isLogin ? await login(loginData) : await register(registerData);
    setLoading(false)
    console.log(res, 'res');
    if(res.code == 200){
      
      Toast.show({
        icon: 'success',
        content: res.message,
      })
      setTimeout(() => {
        navigate(redirect ? '/' + redirect : '/home')
      }, 1500);
    }
    

    // hideLoading()

    // history.push('/home')
  }

  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }, [])

  

  return (
    <>
      <LoadingMask visible={loading} />

      <div className={styles.header}>
        <div className={styles.logoChunk}>
          <img src={logo} alt="" />
          <span>CA</span>
        </div>
        <div className={styles.tips}>
            所有数据都将被加密
        </div>
        <Button onClick={() => navigate('/LanguageSwitchPage')} className={styles.Language}>
          切换语言
        </Button>
      </div>

      <div className={styles.content}>
        <div className={styles.icons}>
          <div className={styles.icon_item}>
             <img src={iogin1} alt="" />
             <span>平台包邮</span>
             <span>专属优惠</span>
          </div>
          <div className={styles.icon_item}>
             <img src={iogin2} alt="" />
             <span>免费退货</span>
             <span>长达90天</span>
          </div>
        </div>

        <div className={styles.from}>
          <Form layout="horizontal" onFinish={onFinish}>
            <Form.Item label="Nickname" name="username">
              <Input placeholder="please input Nickname" />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input placeholder="Password" type='password' />
            </Form.Item>
            {
              !isLogin && 
              <>
                <Form.Item label="Phone" name="phone">
                  <Input placeholder="Phone" />
                </Form.Item>
                <Form.Item label="Fund Password" name="fundpassword">
                  <Input placeholder="Fund Password" type='password' />
                </Form.Item>
                <Form.Item label="Invite code" name="invitecode">
                  <Input placeholder="Invite code"  />
                </Form.Item>
              </>
            }
            <br />
            <br />
            <Form.Item>
              <Button type="primary" htmlType="submit" className={styles.submit}>
                Submit
              </Button>
            </Form.Item>
            <span className={styles.switch} onClick={() => setIsLogin(!isLogin)}>Go to {isLogin ? 'register' : 'login'}</span>

          </Form>
        </div>
      </div>
    </>
  );
}
