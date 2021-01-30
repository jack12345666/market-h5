<template>
  <div class="orderList">
    <div class="orderItem" v-for="(item, index) in orderList" :key="item.id">
    <div class="store" @click="toStore(item.storeid)">
        <div class="name">{{item.storename}}</div> 
        <van-icon name="arrow" style="flex: 1" color="#999999"/>
        <div class="status">{{statusObj[item.status]}}</div>
    </div>
    <div class="goods" @click="toOrderDetail(item.id, item.storeid)">
        <div class="goodsImg">
            <van-image width="64" height="64" style="border-radius: 5px;margin-right: 10px;" :src="item.image | imgFormat" />
        </div>
        <div class="right">
        <div class="name">
            {{item.goodsNames}}
        </div>
        <div class="priceNum">
            <div class="price">{{item.goodsprice}}</div>
            <!-- <div class="num"> x{{item.goodsNum}}</div> -->
        </div>
        </div>
        </div>
        <div class="options">
            <van-button  plain round type="default" size="small" @click="cancelMyOrder(item.id, index)" v-if="item.status === 10 " style="margin-right: 10px;">取消订单</van-button>
            <van-button  plain round type="warning" size="small" @click="toComment(item.id)" v-if="item.status === 20 && item.evaluationstate === 0">评价</van-button>
        </div>
    </div>
    <div v-if="orderList.length === 0">
        <van-empty description="暂无订单" />
    </div>
</div>
</template>

<script>
import { cancelOrder } from '../../api/goods'
import { Toast, Dialog } from 'vant'
import { dingdingToast } from '../../utils/utils.js'
export default {
    props: {
        orderList: {
            type: Array,
            default: function() {
                return []
            }
        }
    },
    data() {
        return {
            statusObj: {
                0: '已取消',
                10: '待确认',
                20: '已完成',
                30: '审核不通过'
            }
        }
    },
    methods: {
        toStore(id) {
            this.$router.push({path: '/store', query: {id}})
        },
        toOrderDetail(id, storeid) {
            this.$router.push({path: '/orderDetail', query: {id, storeid}})
         },
        toComment(id) {
            this.$router.push({path: '/comment', query: {id}})
       },
        cancelMyOrder(id, index) {
           Dialog.confirm({
            title: '',
            message: '是否确定取消该订单',
            })
            .then(() => { 
            cancelOrder(id).then(rsp => {
             if(rsp && rsp.code === 0) {
            //   Toast.success('订单取消成功')
              dingdingToast('success','订单取消成功')
              this.orderList.splice(index, 1)
             }
            }) 
            })
            .catch(() => {
                // on cancel
            });
         
       }
    }
}
</script>

<style lang='scss' scoped>
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
                // color: #ec9e38;
                white-space: nowrap;
                margin-left: 50px;
                font-size: 15px;
                color: #666;
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
</style>