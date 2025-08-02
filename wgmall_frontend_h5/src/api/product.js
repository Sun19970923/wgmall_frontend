/*
 * @Author: Evan sun1148526297@gmail.com
 * @Date: 2025-07-19 02:31:24
 * @LastEditors: Evan sun1148526297@gmail.com
 * @LastEditTime: 2025-08-01 06:05:11
 * @FilePath: \wgmall_frontend\wgmall_frontend_h5\src\api\product.js
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

// 自动派单
export function grab(data) {
  return request({
    url: "/task/grab",
    withCredentials: false,
    method: "post",
    data,
  });
}

// 随机8个商品
export function random() {
  return request({
    url: "/products/random",
    method: "get",
  });
}

// 根据类目 随机8个商品
export function type(params) {
  return request({
    url: "/products/random/type",
    method: "get",
    params
  });
}


// 添加心愿
export function wishlistAdd(data) {
  return request({
    url: "/wishlist/add",
    method: "post",
    data
  });
}


// 获取心愿单list
export function wishlistList(id) {
  return request({
    url: "/wishlist/" + id,
    method: "get",
  });
}

// 单个心愿单
export function wishlistDelete(userId, productId) {
  return request({
    url: `/wishlist/delete/${userId}/${productId}`,
    method: "delete",
  });
}


// 商品付款
export function buy(data) {
  return request({
    url: "/orders/buy",
    method: "post",
    data
  });
}



// 订单页面  全部获取订单列表
export function orderAll(params) {
  return request({
    url: "/orders/buy/all",
    method: "get",
    params
  });
}


// 订单页面  带发货订单列表
export function pendingAll(params) {
  return request({
    url: "/orders/buy/pending",
    method: "get",
    params
  });
}

// 订单页面  带收货订单列表
export function processingAll(params) {
  return request({
    url: "/orders/buy/processing",
    method: "get",
    params
  });

}





// 订单页面  退款订单列表
export function refundingAll(params) {
  return request({
    url: "/orders/buy/refunding",
    method: "get",
    params
  });
}

// 订单页面  送达订单列表
export function deliveredAll(params) {
  return request({
    url: "/orders/buy/delivered",
    method: "get",
    params
  });
}


// 搜索商品
export function search(params) {
  return request({
    url: "/products/search",
    method: "get",
    params
  });
}


// 卖家-商品列表
export function availableProducts(params) {
  return request({
    url: `/shop/${params.shopId}/available-products`,
    method: "get",
    params
  });
}


// 卖家-上架商品获取价格区间
export function priceRange(params) {
  return request({
    url: `/shop/products/priceRange`,
    method: "get",
    params
  });
}


// 
export function shopOrders(params) {
  return request({
    url: `/shop/${params.shopId}/orders`,
    method: "get",
    params
  });
}



// 卖家-自己上架商品列表
export function products(id) {
  return request({
    url: `/shop/${id}/products`,
    method: "get",
    params: {
      size: 100
    }
  });
}


export function summary(id) {
  return request({
    url: `/shop/${id}/order/summary`,
    method: "get",
    params: {
      shopId: id
    }
  });
}

export function payOrder(data) {
  return request({
    url: `/shop/${data.shopId}/payOrder`,
    method: "post",
    data
  });
}



// 卖家-上架商品 
export function listProduct(data) {
  return request({
    url: `/shop/listProduct`,
    method: "post",
    data
  });
}

// 卖家-编辑商品 
export function editPrice(data) {
  return request({
    url: `/shop/products/editPrice`,
    method: "post",
    data
  });
}


// 卖家-下架商品 
export function removeProduct(data) {
  return request({
    url: `/shop/removeProduct`,
    method: "post",
    data
  });
}


