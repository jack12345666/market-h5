<template>
  <base-layout>
   <div slot="content">
      <div class="content">
          <van-tabs v-model="goods.changeTabs" color='#3296FA' :sticky="true" @change="changeTabs">
            <van-tab title="待确认">
            <van-pull-refresh v-model="waitRefreshing" @refresh="onWaitRefresh">
            <van-list
              v-model="waitLoading"
              :finished="waitFinished"
              :immediate-check='false'
              finished-text="没有更多了"
              @load="onWaitLoad"
              > 
              <order-item :orderList="waitOrderList" @refreashList='getFirstWaitOrder'></order-item>
            </van-list>
          </van-pull-refresh>
             
            </van-tab>
            <van-tab title="已完成">
              <van-pull-refresh v-model="okRefreshing" @refresh="onOkRefresh">
                <van-list
                v-model="okLoading"
                :finished="okFinished"
                :immediate-check='false'
                finished-text="没有更多了"
                @load="onOkLoad"
                > 
                <order-item :orderList="okOrderList"></order-item>
                </van-list>
           </van-pull-refresh>
            </van-tab>
            <van-tab title="已取消">
               <van-pull-refresh v-model="cancelRefreshing" @refresh="onCancelRefresh">
                <van-list
                v-model="cancelLoading"
                :finished="cancelFinished"
                :immediate-check='false'
                finished-text="没有更多了"
                @load="onCancelLoad"
                > 
               <order-item :orderList="cancelOrderList"></order-item>
                </van-list>
           </van-pull-refresh>
            </van-tab>
              <van-tab title="审核不通过">
               <van-pull-refresh v-model="unPassRefreshing" @refresh="onUnPassRefresh">
                <van-list
                v-model="unPassLoading"
                :finished="unPassFinished"
                :immediate-check='false'
                finished-text="没有更多了"
                @load="onUnPassLoad"
                > 
               <order-item :orderList="unPassOrderList"></order-item>
                </van-list>
           </van-pull-refresh>
          </van-tab>
          </van-tabs>
      </div>
  </div>
  </base-layout>
</template>

<script>
import { getOrderList } from '../../api/goods'
import OrderItem from './item'
import { mapState } from 'vuex'
export default {
    components: { OrderItem },
    data() {
        return {
            active: 0,
            waitOrderList: [],
            okOrderList: [],
            cancelOrderList: [],
            unPassOrderList: [],
            waitConf: {
                currentPage: 1,
                pageSize: 10,
                status: 10
            },
            okConf: {
                currentPage: 1,
                pageSize: 10,
                status: 20
            },
            cancelConf: {
                currentPage: 1,
                pageSize: 10,
                status: 0
            },
            unPassConf: {
                currentPage: 1,
                pageSize: 10,
                status: 30
            },
            waitLoading: false,
            waitRefreshing: false,
            waitFinished: false,
            okLoading: false,
            okRefreshing: false,
            okFinished: false,
            cancelLoading: false,
            cancelRefreshing: false,
            cancelFinished: false,
            unPassLoading: false,
            unPassRefreshing: false,
            unPassFinished: false,
        }
    },
    computed: {
        ...mapState(['goods'])
    },
    created() {
        if(this.goods.orderTab === 0) {
            this.getFirstWaitOrder()
        }else if(this.goods.orderTab === 1) {
            this.getFirstOkorder()
        }else if(this.goods.orderTab === 2) {
            this.getFirstCancelOrder()
        }else if(this.goods.orderTab === 3) {
            this.getFirstUnPassOrder()
        }
    },  
    methods: {
        changeTabs(title) {
            this.$store.commit('goods/changeOrderTab', title)
            if(title === 0) {
                this.waitOrderList = []
                this.getFirstWaitOrder()
            }else if(title === 1) {
                this.okOrderList = []
                this.getFirstOkorder()
            }else if(title === 2){
                this.cancelOrderList = []
                this.getFirstCancelOrder()
            }else if(title === 3) {
                this.unPassOrderList = []
                this.getFirstUnPassOrder()
            }
        },
        onWaitLoad() {
            this.getMoreWaitOrder()
        },
        onOkLoad() {
            this.getMoreOkOrder()
        },
        onCancelLoad() {
            this.getMoreCancelOrder()
        },
        onUnPassLoad() {
            this.getMoreUnPassOrder()
        },
        onWaitRefresh() {
            this.waitFinished = false;
            this.waitRefreshing = true
            this.waitConf.currentPage = 1
            this.getFirstWaitOrder()
        }, 
        onOkRefresh() {
            this.okFinished = false
            this.okRefreshing = true
            this.okConf.currentPage = 1
            this.getFirstOkorder()
        },
        onCancelRefresh() {
            this.cancelFinished = false
            this.cancelRefreshing = true
            this.cancelConf.currentPage = 1
            this.getFirstCancelOrder()
        },
        onUnPassRefresh() {
            this.unPassFinished = false
            this.unPassRefreshing = true
            this.unPassConf.currentPage = 1
            this.getFirstUnPassOrder()
        },
       async getMoreWaitOrder() {
        this.waitConf.currentPage ++
        let rsp = await getOrderList(this.waitConf)
        if(rsp.data.data.items.length < 10) {
              this.waitOrderList = this.waitOrderList.concat(rsp.data.data.items)
              this.waitLoading = false
              this.waitFinished = true
          }else {
              this.waitOrderList = this.waitOrderList.concat(rsp.data.data.items) 
              this.waitLoading = false
          }
        },
        async getMoreOkOrder() {
        this.okConf.currentPage ++
        let rsp = await getOrderList(this.okConf)
        if(rsp.data.data.items.length < 10) {
              this.okOrderList = this.okOrderList.concat(rsp.data.data.items)
              this.okLoading = false
              this.okFinished = true
          }else {
              this.okOrderList = this.okOrderList.concat(rsp.data.data.items) 
              this.okLoading = false
          }
        },
        async getMoreCancelOrder() {
        this.cancelConf.currentPage ++
        let rsp = await getOrderList(this.cancelConf)
        if(rsp.data.data.items.length < 10) {
              this.cancelOrderList = this.cancelOrderList.concat(rsp.data.data.items)
              this.cancelLoading = false
              this.cancelFinished = true
          }else {
              this.cancelOrderList = this.cancelOrderList.concat(rsp.data.data.items) 
              this.cancelLoading = false
          }
        },
     async getMoreUnPassOrder() {
        this.unPassConf.currentPage ++
        let rsp = await getOrderList(this.unPassConf)
        if(rsp.data.data.items.length < 10) {
              this.unPassOrderList = this.unPassOrderList.concat(rsp.data.data.items)
              this.unPassLoading = false
              this.unPassFinished = true
          }else {
              this.unPassOrderList = this.unPassOrderList.concat(rsp.data.data.items) 
              this.unPassLoading = false
          }
     },
      async getFirstWaitOrder() {
        this.waitConf.currentPage = 1
        let rsp = await getOrderList(this.waitConf)
        if(rsp && rsp.code === 0) {
            this.waitOrderList = rsp.data.data.items
            this.waitRefreshing = false
        }
      },
      async getFirstOkorder() {
        this.okConf.currentPage = 1
        let rsp = await getOrderList(this.okConf)
        if(rsp && rsp.code === 0) {
            this.okOrderList = rsp.data.data.items
            this.okRefreshing = false
        }
      },
      async getFirstCancelOrder() {
        this.cancelConf.currentPage = 1
        let rsp = await getOrderList(this.cancelConf)
        if(rsp && rsp.code === 0) {
            this.cancelOrderList = rsp.data.data.items
            this.cancelRefreshing = false
        }
      },
      async getFirstUnPassOrder() {
        this.unPassConf.currentPage = 1
        let rsp = await getOrderList(this.unPassConf)
        if(rsp && rsp.code === 0) {
            this.unPassOrderList = rsp.data.data.items
            this.unPassRefreshing = false
        }
      }
    }
    
}
</script>

<style lang='scss' scoped>
.content {
    height: calc(100vh - 50px);
    .orderList {
        padding: 10px;
     .orderItem {
        background-color: #ffffff;
        padding: 10px;
        border-radius: 10px;
        margin-bottom: 10px;
        .store {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .name {
              font-size: 16px;
              font-weight: 700;
              display: -webkit-box;
              overflow: hidden;
              white-space: normal;
              text-overflow: ellipsis;
              word-wrap: break-word;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            .status {
                color: #ec9e38;
                white-space: nowrap;
                margin-left: 50px;
                font-size: 15px;
            }
        }
        .goods {
            display: flex;
            .right {
              display: flex;
              flex-direction: column;
              justify-content: space-between;  
             .name {
                color: #333;
                font-size: 14px;
                display: -webkit-box;
                overflow: hidden;
                white-space: normal;
                text-overflow: ellipsis;
                word-wrap: break-word;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .priceNum {
                width: 245px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .price {
                    color: red;
                }
                .num {
                    margin-right: 10px;
                    color: #999;
                }
              }  
            }
        }
        .options {
            margin-top: 5px;
            text-align: right;
        }
      }
    } 
}
</style>