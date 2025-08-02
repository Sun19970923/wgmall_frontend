/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-09 15:03:35
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 05:44:04
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\api\user.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// axios
import request from "@/utils/request";

//################### #使用mock时不设置baseURL ####################//
import axios from "axios";
// create an axios instance
const service = axios.create({
  baseURL: baseApi, // url = base api url + request url  如果使用 mock 去掉此项
  withCredentials: false, // send cookies when cross-domain requests
  crossDomain: true,
  timeout: 10000, // request timeout
});
export function getCaptchaMock(params) {
  return service({
    url: "/user/captcha/getCaptcha",
    withCredentials: false,
    method: "get",
    params,
  });
}
//################### #使用mock时不设置baseURL ####################//

export function getCaptcha(params) {
  return request({
    url: "/user/captcha/getCaptcha",
    withCredentials: false,
    method: "get",
    params,
  });
}

// 注册
export function register(data) {
  return request({
    url: "/auth/register",
    withCredentials: false,
    method: "post",
    data,
  });
}


// 获取用户信息
export function info(params) {
  return request({
    url: "/user/user-detail/"+params.userId,
    withCredentials: false,
    method: "get",
  });
}


// 获取用户心愿单
export function wishlist(params) {
  return request({
    url: "/wishlist/"+params.userId,
    withCredentials: false,
    method: "get",
  });
}

// 获取用户心愿单
export function message(params) {
  return request({
    url: "/message/inbox",
    withCredentials: false,
    method: "get",
    params
  });
}


// 用户创建地址
export function create(data) {
  let id = data.id;
  delete data.id;

  return request({
    url: "/address/create?userId=" + id,
    withCredentials: false,
    method: "post",
    data
  });
}

// 用户获取地址
// params userId
export function getAddress(params) {
  return request({
    url: "/address/get",
    withCredentials: false,
    method: "get",
    params
  });
}

// 用户更新地址
export function updataAddress(data) {
  return request({
    url: "/address/update?userId=" + data.id,
    withCredentials: false,
    method: "post",
    data
  });
}


// 用户领红包
export function draw(data) {
  return request({
    url: "/redbag/draw",
    withCredentials: false,
    method: "post",
    data
  });
}



// 获取用户盈利信息
export function profit(params) {
  return request({
    url: "/user/profit",
    withCredentials: false,
    method: "get",
    params
  });
}

// 登录
export function login(data) {
  return request({
    url: "/auth/login",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 签到
export function signin(data) {
  return request({
    url: "/redbag/signin",
    withCredentials: false,
    method: "post",
    data,
  });
}
// 签到 & 领红包
export function redbag(data) {
  return request({
    url: "/redbag/signin-and-draw",
    withCredentials: false,
    method: "post",
    data,
  });
}


// 开店申请
export function apply(data) {
  return request({
    url: "/seller/apply",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 贷款申请
export function loan(data) {
  return request({
    url: "/loan/apply",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 贷款数量
export function loanNum(data) {
  return request({
    url: "/loan/loan",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 还款数量
export function repay(data) {
  return request({
    url: "/loan/repay",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 提现接口
export function withdrawalUser(data) {
  return request({
    url: "/withdrawal-records/user",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 充值记录列表
export function rechargeRecords(params) {
  return request({
    url: "/recharge-records/username",
    withCredentials: false,
    method: "get",
    params,
  });
}

// 充值记录列表
export function rechargeRecordsUser(data) {
  return request({
    url: "/recharge-records/user",
    withCredentials: false,
    method: "post",
    data,
  });
}


// 提现记录列表
export function withdrawalRecords(params) {
  return request({
    url: "/withdrawal-records/username",
    withCredentials: false,
    method: "get",
    params,
  });
}


// 卖家-获取店铺信息
export function shopHome(userId) {
  return request({
    url: "/shop/user/"+userId,
    withCredentials: false,
    method: "get",
  });
}

// 卖家-获取用户所有信息
export function userInfo(userId) {
  return request({
    url: "/user/info/" + userId,
    withCredentials: false,
    method: "get",
  });
}

// 获取卖家信息
export function uploaderToUserid(params) {
  return request({
    url: "/products/uploader-to-userid?uploader=" + params.uploader,
    withCredentials: false,
    method: "get",
  });
}


// 获取用户eth地址
export function withdrawalETHHistory(params) {
  return request({
    url: "/user/eth/get",
    withCredentials: false,
    method: "get",
    params,
  });
}


// 获取用户tron地址
export function withdrawalTronHistory(params) {
  return request({
    url: "/user/tron/get",
    withCredentials: false,
    method: "get",
    params,
  });
}

// 设置eth地址
export function ethSet(data) {
  return request({
    url: "/user/eth/set",
    withCredentials: false,
    method: "put",
    data,
  });
}


// 设置tron地址
export function tronSet(data) {
  return request({
    url: "/user/tron/set",
    withCredentials: false,
    method: "put",
    data,
  });
}



// 获取ip
export function getIP() {
  return fetch("https://api.ipify.org?format=json");
}
