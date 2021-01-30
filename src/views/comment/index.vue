<template>
  <div class="box">
      <div class="content">
          <div class="goods">
                <div class="goodsImg">
                    <van-image width="64" height="64" style="border-radius: 5px;margin-right: 10px;" :src="orderDetail.mallordergoods[0].goodsimage | imgFormat" />
                </div>
                <div class="right">
                <div class="name">
                    {{orderDetail.mallordergoods[0].goodsname}}
                </div>
                <div class="priceNum">
                    <div class="price">{{orderDetail.mallordergoods[0].goodsprice | priceFormat}}</div>
                    <div class="num"> x{{orderDetail.mallordergoods[0].goodsnum}}</div>
                </div>
              </div>
            </div>
          <div class="rate">
             <div class="label">评价等级</div>  
              <van-rate v-model="value" size="24px" />
          </div>
          <div class="comment">
              <van-field
                v-model="comment"
                rows="5"
                autosize
                type="textarea"
                placeholder="请写下您的评价"
                />
          </div>
      </div>
      <div class="subBtn">
          <van-button type="info" round block @click="toComment">发布</van-button>
      </div>
  </div>
</template>

<script>
import { getOrderDetail, evaluateOrder } from '../../api/goods'
import { Toast } from 'vant'
import { dingdingToast } from '../../utils/utils'
export default {
    data() {
        return {
            value: null,
            comment: '',
            orderId: null,
            orderDetail: null,
        }
    },
    created() {
        this.orderId = this.$route.query.id
        this.getOrderInfo()
    },
    methods: {
        async getOrderInfo() {
        let rsp = await getOrderDetail(this.orderId)
        if(rsp && rsp.code === 0) {
          this.orderDetail = rsp.data.data
        }
      },
     async toComment() {
         if(!this.value) {
            // Toast('请选择评价等级')
            dingdingToast('', '请选择评价等级')
            return
         }
         let data = {
            id: this.orderId,
            evaluationScore: this.value,
            evaluationDesc: this.comment
         }
         let rsp = await evaluateOrder(data) 
         if(rsp && rsp.code === 0) {
            // Toast.success('评价成功')
             dingdingToast('success','评价成功')
            this.$router.push('/order')
         }
     }
    }
}
</script>

<style lang='scss' scoped>
.box {
    background-color: #f5f5f5;
    height: 100vh;
    // padding-top: 10px;
    box-sizing: border-box;
    .content {
        .goods {
            background-color: #ffffff;
            display: flex;
            margin-bottom: 10px;
            padding: 10px;
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
                }
                .num {
                    margin-right: 10px;
                    color: #999;
                }
              }  
            }
        }
        .rate {
            background-color: #ffffff;
            padding:10px;
            display: flex;
            align-items: center;
            .label {
                margin-right: 20px;
                padding-top: 5px;
                color: #666;
            }
        }
    }
    .subBtn {
        margin-top: 20px;
        text-align: center;
        width: 80%;
        margin-left: 10%;
    }
}
</style>