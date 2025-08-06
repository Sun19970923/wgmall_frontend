/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-06 23:48:32
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\utils\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from "axios";
import { Toast } from 'antd-mobile'
import { useNavigate } from "react-router-dom";
// import { history } from 'umi';

// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url  如果使用 mock 去掉此项
  withCredentials: false,
  crossDomain: true,
  timeout: 100000, // request timeout
});
// request拦截器 request interceptor
service.interceptors.request.use(
  (config) => {
    // 设置用户token
    if(config.url === '/auth/register' || config.url === '/auth/login'){
      return config;
    }

    if(config.url === '/user/apply' || config.url === '/loan/apply'){
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    let token = localStorage.getItem("token")
    if(token){
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// respone拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    console.log("response-->", res);

    if(Array.isArray(res)){
      return Promise.resolve(res);
    }

    if(res.data?.token){
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("userInfo", JSON.stringify(res.data.user))
    }

    if (res.code !== 200) {
      Toast.show({
        icon: 'fail',
        content: res.message,
      })
      return Promise.resolve(res);
    } else {
      if (res.code === 200 || res.message === "SUCCESS") {
        return Promise.resolve(res);
      } else if (res.code === 305 || res.code === 306) {
        Promise.reject(res || "error");
        return;
      } else if (res.code === 403) {
        Toast.show({
          icon: 'fail',
          content: res.message,
        })
        
        // 跳转到登录页
        // history.push('/login');
        return Promise.resolve(res || "error");
      } else {
        return Promise.reject(res || "error");
      }
    }
  },
  (error) => {
    console.log(error, 'error');
    if(error.status === 403){
      Toast.show({
        icon: 'fail',
        content: error.message,
      })

      // 清除 token
      localStorage.removeItem('token');

      setTimeout(() => {
        // 跳转到登录页
        // history.push('/login');
      }, 1000);
    }

    
    console.log("request error" + error, typeof error); // for debug
    return Promise.reject(error);
  }
);

export default service;
