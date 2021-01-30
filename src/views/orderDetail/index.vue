<template>
  <div class="box">
     <div class="content">
       <div class="info">
         <div class="img">
           <van-image width="43" height="32" :src="require('../../assets/address.png')" />
         </div>
         <div class="addInfo">
           <div class="top">
             <div class="name">{{orderDetail.username}}</div>
             <div class="phone">{{orderDetail.userphone}}</div>
           </div>
           <!-- <div class="bottom">{{orderDetail.useremail}}</div> -->
         </div>
       </div>
         <div class="storeDetail">
             <div class="store" @click="toStore(orderDetail.storeid)">
                <div class="name">{{orderDetail.storename}}</div> 
                <van-icon name="arrow" color="#999999"/>
            </div>
             <div class="cell">
              <div class="label">联系人:</div>
              <div class="value">{{storeDetail.contact}}</div> 
            </div>
             <div class="cell">
              <div class="label">联系方式:</div>
              <div class="value">{{storeDetail.phone}}</div> 
            </div>
             <div class="cell">
              <div class="label">工作时间:</div>
              <div class="value">{{storeDetail.workingtime}}</div> 
            </div>
        </div>
        <div class="goodsDetail">
          <div class="title">商品信息</div>
            <div class="goodsItem" v-for="item in orderDetail.mallordergoods" :key="item.id">
              <div class="goods">
                <div class="goodsImg">
                    <van-image width="64" height="64" style="border-radius: 5px;margin-right: 10px;" :src="item.goodsimage | imgFormat" />
                </div>
                <div class="right">
                <div class="name">
                    {{item.goodsname}}
                </div>
                <div class="priceNum">
                    <div class="price">{{item.goodsprice | priceFormat}}</div>
                    <div class="num"> x{{item.goodsnum}}</div>
                </div>
              </div>
            </div>
             <div class="conPhone">
              <div class="label">联系方式</div>
              <div class="value">{{item.contact}}&nbsp;&nbsp;{{item.phone}}</div>
              </div> 
            </div>
          </div>
        <div class="orderDetail">
            <div class="title">订单信息</div>
            <div class="cell">
              <div class="label">订单编号:</div>
              <div class="value">{{orderDetail.no}}</div> 
            </div>
            <div class="cell">
              <div class="label">状态:</div>
              <div class="value">{{statusObj[orderDetail.status]}}</div>
            </div>
            <div class="cell">
              <div class="label">购买时间:</div>
              <div class="value">{{orderDetail.addtime}}</div>
            </div>
        </div>
        <div class="comment" v-if="orderDetail.evaluationstate === 1">
          <div class="cell">
              <div class="label">评分</div>
              <div class="value">
                <van-rate v-model="orderDetail.evaluationScore" readonly size="22px" />
              </div>
            </div>
             <div class="cell" v-if="orderDetail.evaluationDesc">
              <div class="label">评价</div>
              <div class="value">
                {{orderDetail.evaluationDesc}}
              </div>
            </div>
        </div>
     </div>
  </div>
</template>

<script>
import { getOrderDetail, storeDetail } from '../../api/goods'
export default {
    data() {
      return {
        orderId: null,
        orderDetail: null,
        storeId: null,
        statusObj: {
            0: '已取消',
            10: '待确认',
            20: '已完成',
            30:　'审核不通过'
        },
        storeDetail: {
          contact: '',
          phone: null,
          workingtime: null,
        },
      }
    },
    created() {
      this.orderId = this.$route.query.id
      this.storeId = this.$route.query.storeid
      this.getOrderInfo()
      this.getStoreDetail()
    },
    methods: {
      async getOrderInfo() {
        let rsp = await getOrderDetail(this.orderId)
        if(rsp && rsp.code === 0) {
          this.orderDetail = rsp.data.data
        }
      },
      async getStoreDetail() {
        let rsp = await storeDetail(this.storeId)
        if(rsp && rsp.code === 0) {
          const { username, workingtime, phone } = rsp.data.data
          this.storeDetail.contact = username
          this.storeDetail.phone = phone
          this.storeDetail.workingtime = workingtime
        }
      },
      toStore(id) {
        this.$router.push({path: '/store', query: {id}})
      },
    }
}
</script>

<style lang='scss' scoped>
.box {
  background-color: #f5f5f5;
  height: 100vh;
  .content {
     padding-top: 10px;
     .info {
       display: flex;
       align-items: center;
       background-color: #ffffff;
       padding: 10px;
       margin-bottom: 10px;
        .img {
          margin-right: 10px;
        }
        .addInfo {
          .top {
            display: flex;
            align-items: center;
            .name {
              margin-right: 10px;
              color: #666;
              font-size: 15px;
            }
            .phone {
              color: #999;
              font-size: 15px;
            }
          }
          .bottom {
            color: #666;
            font-size: 15px;
            margin-top: 5px;
          }
        }
     }
     .goodsDetail {
        background-color: #ffffff;
        padding: 10px;
        margin-bottom: 10px;
         .title {
        font-size: 15px;
        margin-bottom: 10px;
        }
        .goodsItem {
          border-bottom: 1px solid #f5f5f5;
          &:last-child {
            border: none;
          }
        .goods {
          margin-top: 10px;
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
                margin-bottom: 5px;
                .price {
                    color: red;
                    font-size: 13px;
                }
                .num {
                    margin-right: 10px;
                    color: #999;
                }
              }  
            }
           
        } 
        .conPhone {
              display: flex;
              margin: 10px 0;
              font-size: 14px;
              .label {
                color: #999;
                width: 80px;
              }
              .value {
                color: #666;
              }
          }
      }
    }
    .orderDetail {
      background-color: #ffffff;
      padding: 10px;
      margin-bottom: 10px;
      .title {
        font-size: 15px;
        margin-bottom: 10px;
      }
      .cell {
        display: flex;
        align-items: center;
        margin: 10px 0;
        .label {
          color: #999;
          font-size: 14px;
          width: 80px;
        }
        .value {
          color: #666;
          font-size: 14px;
        }
      }
    }
    .storeDetail {
      background-color: #ffffff;
      padding: 10px;
      margin-bottom: 10px;
      .title {
        font-size: 15px;
        margin-bottom: 10px;
      }
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
        }
        .cell {
        display: flex;
        align-items: center;
        margin: 10px 0;
        .label {
          color: #999;
          font-size: 14px;
          width: 80px;
        }
        .value {
          color: #666;
          font-size: 14px;
        }
      }
    }
    .comment {
      background-color: #ffffff;
      padding: 10px;
      margin-top: 10px;
      .cell {
        margin: 5px 0;
       .label {
          color: #666;
          font-size: 14px;
          margin-bottom: 5px;
        }
        .value {
          margin-left: 5px;
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
}
</style>