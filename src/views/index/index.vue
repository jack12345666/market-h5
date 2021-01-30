<template>
  <base-layout>
  <!-- 搜索框 -->
   <div slot="header" class="header">
    <van-search
      @focus="onFocus"
      shape="round"
      placeholder="请输入搜索关键词"
    />
  </div>
  <div slot="content">
      <div class="content" id="content" ref='index'>
        <!-- swiper -->
       <van-swipe :autoplay="5000" :stop-propagation="false" indicator-color="white" height="150">
          <van-swipe-item v-for="(item, index) in swipeImg" :key="index">
            <img width="100%" :src="item.image" @click="bannerTo(item)"/>
          </van-swipe-item>
        </van-swipe>
        <!-- 一级菜单 -->
        <div style="background: #ffffff;">
          <van-swipe :autoplay="9999999999" :stop-propagation="false"  @change="onChangeMenu">
          <van-swipe-item>
             <van-grid :border='false' :column-num="4">
              <van-grid-item v-for="item in menuList.slice(0, 8)" :key="item.id" @click="toCategory(item.id, item.name)">
                <div class="menuItem">
                <van-image :src="item.comment" width='32px'/>
              <div class="name">{{item.name}}</div>
              </div>
            </van-grid-item>
          </van-grid>
          </van-swipe-item>
           <van-swipe-item v-if="menuList.length >= 9">
             <van-grid :border='false' :column-num="4">
              <van-grid-item v-for="item in menuList.slice(8, 9999)" :key="item.id" @click="toCategory(item.id, item.name)">
                <div class="menuItem">
                <van-image :src="item.comment" width='32px'/>
              <div class="name">{{item.name}}</div>
              </div>
            </van-grid-item>
          </van-grid>
          </van-swipe-item>
           <template #indicator v-if="menuList.length >= 9">
            <div class="custom-indicator">
              <div :class="current === 0 ? 'indicator indicatorColor' : 'indicator'"></div>
              <div :class="current === 1 ? 'indicator indicatorColor' : 'indicator'"></div>
            </div>
          </template>
        </van-swipe>
      </div>
        <!-- 商品瀑布流 -->
        <div class="goods" >
          <div class="title">
            <div class="sign"></div>
            <div class="name">全部商品</div>
          </div>
           <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
            <van-list
              v-model="loading"
              :finished="finished"
              :immediate-check='false'
              finished-text="没有更多了"
              @load="onLoad"
              >
              <Goods :goodsList="goodsList"/>
            </van-list>
          </van-pull-refresh> 
      </div> 
      <back-top @backtop="backTop" :visible="backToTop"></back-top>
    </div>
  </div>
  </base-layout>
</template>

<script>
import Goods from '../../components/goods'
import BackTop from '../../components/backTop'
import { getTreeGoodsCategorys, getGoodsList, getIndexBanner } from '../../api/goods'
import { BASELOGINURL } from '../../utils/config'
import { dingdingOpenLink } from '../../utils/utils'
export default { 
   beforeRouteEnter (to, from, next) {
        next(vm => {
        const indexContainer = vm.$refs.index
          // 记录滚动高度
          indexContainer.scrollTop = vm.$route.meta.scroll || 0
        })
      },
      beforeRouteLeave (to, from, next) {
        const indexContainer = this.$refs.index
        this.$route.meta.scroll = indexContainer.scrollTop
      next()
    },
    components: { Goods, BackTop },
    data() {
        return {
            swipeImg: [],
            loading: false,
            finished: false,
            refreshing: false,
            current: 0,
            backToTop: false,
            goodsList: [],
            searchConf: {
                currentPage: 1,
                pageSize: 10
          },
          bannerConf: {
            currentPage: 1,
            pageSize: 10
          },
          menuList: [],
        }
    },
    created() {
      this.getMenuList()
      this.getFirstGoods()
      this.getBanner()
    },
    mounted() {
       document.getElementById('content').addEventListener("scroll", this.scrollToTop);
    },
    methods: {
      backTop() {
        document.getElementById('content').scrollTop = 0
      },
      scrollToTop() {
      let scrollTop = document.getElementById('content').scrollTop
      if (scrollTop > 400) {
        this.backToTop = true
      } else {
        this.backToTop = false
      }
     },
      onFocus() {
        this.$router.push('/search')
      },
      bannerTo(item) {
        if(item.type === 0 && item.relateid) {
          this.$router.push({path: '/goodsDetail', query: {id: item.relateid}})
        }
        if(item.type === 1 && item.relateid) {
          this.$router.push({path: '/store', query: {id: item.relateid}})
        }
        if(item.type === 2 && item.relateurl) {
            dingdingOpenLink(item.relateurl)
        }
      },
      onChangeMenu(index) {
        this.current = index
      },
      toCategory(id, name) {
        this.$router.push({path: '/category', query: {id, name}})
      },
      onLoad() {
        this.getMoreGoodsList()
      },
      onRefresh() {
        this.finished = false;
        this.refreshing = true
        this.searchConf.currentPage = 1
        this.getFirstGoods()
      },
      async getMenuList() {
        let rsp = await getTreeGoodsCategorys()
        if(rsp && rsp.code === 0) {
          this.menuList = rsp.data.data.filter(item => item.category === '0151')
          this.$store.commit('goods/changeMenuList', this.menuList)
          this.$store.commit('goods/changeServiceObj', rsp.data.data.filter(item => item.category === '0152'))
          this.$store.commit('goods/changeOrgList', rsp.data.data.filter(item => item.category === '0153'))
          this.$store.commit('goods/changeServiceType', rsp.data.data.filter(item => item.category === '0154'))
          this.$store.commit('goods/changeChargeMode', rsp.data.data.filter(item => item.category === '0155'))
        }
      },
      async getFirstGoods() {
        let rsp = await getGoodsList(this.searchConf)
        if(rsp && rsp.code === 0) {
          this.goodsList = rsp.data.data.items
          this.refreshing = false
        }
      },
      async getBanner() {
        let rsp = await getIndexBanner(this.bannerConf)
        if(rsp && rsp.code === 0) {
          this.swipeImg = rsp.data.data.items
        }
      },
      async getMoreGoodsList() {
        this.searchConf.currentPage ++
        let rsp = await getGoodsList(this.searchConf)
        if(rsp.data.data.items.length < 10) {
              this.goodsList = this.goodsList.concat(rsp.data.data.items)
              this.loading = false
              this.finished = true
          }else {
              this.goodsList = this.goodsList.concat(rsp.data.data.items) 
              this.loading = false
          }
      }
    }
}
</script>

<style lang='scss' scoped>
  .content {
     height: 100vh;
    // height: calc(100vh - 120px);
   .menuItem {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .name {
        margin-top: 5px;
        color: #666666;
      } 
    }

   .custom-indicator {
      width: 40px;
      position: absolute;
      right: calc(50% - 20px);
      bottom: 5px;
      padding: 2px 5px;
      font-size: 12px;
      display: flex;
      justify-content: center;
      .indicator {
        width: 20px;
        height: 3px;  
        border-radius: 8px;
        background-color: #f5f5f5;
      }
      .indicatorColor {
        background-color: #3296FA;
      }
    }
   .goods {
     margin-top: 10px;
     .title {
       background-color: #ffffff;
       display: flex;
       align-content: center;
       padding: 10px;
       .sign {
         height: 20px;
         width: 3px;
         background-color: #3296FA;
         border-radius: 5px;
         margin-right: 10px;
       }
     }
   }
   
}

</style>