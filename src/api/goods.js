import request from '../utils/request'
import {stringify} from 'qs'

// 获取商品分类
export function getTreeGoodsCategorys() {
    return request({
        url: '/common/treeGoodsCategorys',
        method: 'post',
      })
}

// 获取商品列表
export function getGoodsList(data) {
    return request({
        url: '/goods/list',
        method: 'post',
        data: stringify(data)
    })
}

// 商品详情
export function getGoodsDetail(id) {
    return request({
        url: '/goods/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 商品直接申请
export function toOrderGoods(data) {
    return request({
      url: '/order/addByGoods',
      method: 'post',
      data: stringify(data)
    })
  }

// 订单列表
export function getOrderList(data) {
    return request({
        url: `/order/listForBuyer?${stringify(data)}`,
        method: 'post',
    })
}

// 订单详情
export function getOrderDetail(id) {
    return request({
        url:  `/order/detail?id=${id}`,
        method: 'post',
    })
}

// 下单
export function toAddOrder(ids) {
    return request({
        url: '/order/add',
        method: 'post',
        data: `cartIds=${ids}`
    })
}

// 评价订单
export function evaluateOrder(data) {
    return request({
        url: '/order/evaluate',
        method: 'post',
        data: stringify(data)
    })
}

// 取消订单
export function cancelOrder(id) {
    return request({
        url: '/order/cancel',
        method: 'post',
        data: `id=${id}`
    })
}

// 加入购物车
export function addCart(data) {
    return request({
        url: '/cart/add',
        method: 'post',
        data: stringify(data)
    })
}

// 移除购物车商品
export function removeCartGoods(data) {
    return request({
        url: '/cart/remove',
        method: 'post',
        data: stringify(data)
    })
}

// 购物车列表
export function cartList(data) {
    return request({
        url: '/cart/list',
        method: 'post',
        data: stringify(data)
    })
}

// 清空购物车
export function removeAllCart() {
    return request({
        url: '/cart/removeAll',
        method: 'post',
    })
}

// 店铺详情
export function storeDetail(id) {
    return request({
        url: '/store/detail',
        method: 'post',
        data: `id=${id}`
    })
}

// 首页轮播图
export function getIndexBanner(data) {
    return request({
        url: '/rotationImage/list',
        method: 'post',
        data: stringify(data)
    })
}
