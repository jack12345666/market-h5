import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/index'
import Cart from '@/views/myCart'
import Order from '@/views/order'
import Category from '@/views/category'
import OrderDetail from '@/views/orderDetail'
import GoodsDetail from '@/views/goodsDetail'
import Store from '@/views/store'
import Search from '@/views/search'
import Comment from '@/views/comment'
import SearchList from '@/views/searchList'
import { dingdingTitle } from '../utils/utils'

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    { path: '/', name: 'index', component: Index, meta: { title: '资源超市', keepAlive: true } }, 
    { path: '/cart', name: 'cart', component: Cart, meta: { title: '购物车' } },
    { path: '/order', name: 'order', component: Order, meta: { title: '订单'} },
    { path: '/category', name: 'category', component: Category },
    { path: '/store', name: 'store', component: Store },
    { path: '/orderDetail', name: 'orderDetail', component: OrderDetail, meta: { title: '订单详情' } },
    { path: '/goodsDetail', name: 'goodsDetail', component: GoodsDetail, meta: { title: '商品详情' } },
    { path: '/search', name: 'search', component: Search, meta: { title: '搜一搜' } },
    { path: '/comment', name: 'comment', component: Comment, meta: { title: '发表评价' } },
    { path: '/searchList', name: 'searchList', component: SearchList, meta: { title: '搜索结果' } },
    { path: '/redirect/:path*',component: () => import('@/views/redirect/index')},
  ]
})

router.beforeEach((to, from, next) => {
	if (to.meta.title) {
    document.title = to.meta.title;
    dingdingTitle(document.title)
  }else{
    document.title = '资源超市'
  }
  next()
})

export default router
