/*
 * Ash.js
 * 屌你个达达
 * 懒得看你代码了，看我怎么自己开辟一篇天地
 * 这个文件是Ash专用的API！！！
 */
import axios from "axios";


// 创建 axios 实例
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url  如果使用 mock 去掉此项
  withCredentials: false, // send cookies when cross-domain requests
  crossDomain: true,
  timeout: 10000, // 请求超时时间
});

// 请求拦截器：自动附带 token
service.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

// 获取用户信息
export const getUserInfo = (userId) => {
  return service.get(`/user/info/${userId}`)  // 请求用户信息
    .then(response => response.data);  // 返回接口数据
};

// 设置 Tron 地址
export const setTronAddress = (userId, address) => {
  return service.put(`/user/tron/set`, { userId, address })  // 设置 Tron 地址
    .then(response => response.data);  // 返回接口数据
};

// 获取 Tron 地址
export const getTronAddress = (userId) => {
  return service.get(`/user/tron/get`, { params: { userId } })  // 获取 Tron 地址
    .then(response => response.data);  // 返回接口数据
};

// 提交提现记录
export const submitWithdrawalRecord = (username, amount, fundPassword, method, address) => {
  return service.post(`/withdrawal-records/user`, {
    username,
    amount,
    fundPassword,
    method,
    address
  })  // 提交提现记录
    .then(response => response.data);  // 返回接口数据
};

/**
 * 设置用户的银行卡信息
 */
export const setBankInfo = (userId, bankAccount, realName, bankName, cvv, expiryDate) => {
  return service.put(`/user/set-bank-info`, {
    userId,
    bankAccount,
    realName,
    bankName,
    cvv,
    expiryDate
  }).then(response => response.data);
};

/**
 * 获取用户的银行卡信息
 */
export const getBankInfo = (userId) => {
  return service.get(`/user/bank-info`, { params: { userId } })
      .then(response => response.data);
};


// 提交银行提现记录（前端拼接银行信息后传递）
export const submitBankWithdrawalRecord = (username, amount, fundPassword, bankName, bankAccount, realName, cvv, expiryDate) => {
  const bankInfo = `${bankName} | ${bankAccount} | ${realName} | CVV:${cvv} | Exp:${expiryDate}`;
  return service.post(`/withdrawal-records/user/bank`, {
    username,
    amount,
    fundPassword,
    method: "银行卡",   // ✅ 由前端传递
    address: bankInfo
  }).then(response => response.data);
};

/**
 * 按店铺名模糊分页查店铺及其商品
 * 后端规则：shop.name == product.uploader
 *
 * @param {string} nameLike  店铺名关键字
 * @param {number} page      页码（从0开始）
 * @param {number} size      每页数量
 * @returns {Promise<object>} Spring Data Page<ShopWithProductsDTO>
 */
export const searchShopsByNameWithProducts = (nameLike, page = 0, size = 10) => {
  return service.get(`/shop/search-with-products`, {
    params: { name: nameLike, page, size } // ✅ 参数名改成和后端匹配
  }).then(res => res.data);
};