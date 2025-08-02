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

// 自动派单
export function grab(data) {
  return request({
    url: "/task/grab",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 提交购买
export function complete(data) {
  return request({
    url: "/task/complete",
    withCredentials: false,
    method: "post",
    data,
  });
}


export function pendingList(data) {
  return request({
    url: "/task/pending",
    withCredentials: false,
    method: "post",
    data,
  });
}



export function historyList(data) {
    return request({
      url: "/task/history",
      withCredentials: false,
      method: "post",
      data,
    });
  }
  