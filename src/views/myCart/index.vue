<template>
  <base-layout>
  <div slot="header">
      <div class="top">
      <div class="header">
          <div class="title">购物车</div>
          <div class="number" v-if="goodsList.length > 0">共{{goodsList.length}}个资源</div>
      </div>
      <div class="setting" @click="toSetting">{{isSetting ? '完成' : '管理'}}</div>
    </div>
  </div>
  <div slot="content">
      <div class="content">
          <div class="cartGoods">
                <div class="item" v-for="item in goodsList" :key="item.id">
                    <div class="check">
                        <van-checkbox v-model="item.isChecked"></van-checkbox>
                    </div>
                    <div class="info">
                        <div class="store" @click="toStore(item.storeid)">
                            <div class="name">{{item.storename}}</div> 
                            <van-icon name="arrow" color="#999999"/>
                        </div>
                        <div class="goods" @click="toGoods(item.goodsid)">
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
                    </div>
                </div>
          </div>
          <van-empty
            v-if="goodsList.length === 0"
            class="custom-image"
            image="https://img.yzcdn.cn/vant/custom-empty-image.png"
            description="购物车竟然是空的"
            />
            <div class="toSee"  v-if="goodsList.length === 0">
               <van-button type="default" size="small" @click="toIndex">去逛逛</van-button>
            </div>
      </div>
      <div class="settleFooter">
          <div class="check">
              <van-checkbox  :value="isCheckAll" @click="allChecked">全选</van-checkbox>
          </div>
          <div class="checkNum" v-if="!isSetting">共选中
            <span class="value">{{selectedData.length}}</span>  
              件</div>
          <div class="sumBtn" v-if="!isSetting">
              <van-button color="#3296FA" round  size="small" @click="apply">一键申请</van-button>
          </div>
          <div class="sumBtn" v-if="isSetting">
              <van-button type="danger" round plain  size="small" @click="removeCart">删除</van-button>
          </div>
      </div>
  </div>
  </base-layout>
</template>

<script>
import { cartList, toAddOrder, removeCartGoods } from '../../api/goods'
import { Toast } from 'vant'
import { dingdingToast } from '../../utils/utils.js'
export default {
    data() {
        return {
            goodsList: [],
            isSetting: false,
        }
    },
    created() {
        this.getMyCart()
    },
    computed: {
        isCheckAll() {
            if(this.goodsList.length === 0) {
                return false
            }else {
               return this.goodsList.find(item => !item.isChecked) === undefined  
            }
        },
        selectedData() {
            return  this.goodsList.filter(item => item.isChecked)
        }
    },
    methods: {
        async getMyCart() {
            let rsp = await cartList()
            if(rsp && rsp.code === 0) {
                this.goodsList = rsp.data.data
            }
        },
       async apply() {
         let arr =  this.goodsList.filter(item => item.isChecked)
         if(arr.length === 0) {
             return
         }
        let idArr = []
        arr.forEach(item => { idArr.push(item.id) })
        let ids = idArr.join(',')
        let rsp = await toAddOrder(ids)
        if(rsp && rsp.code === 0) {
            // Toast.success('申请成功')
            dingdingToast('success','申请成功')
            this.getMyCart()
        }
        },
        toSetting() {
            this.goodsList.forEach(item => {
                item.isChecked = false;
            });
            this.isSetting = !this.isSetting
            
        },
        async removeCart() {
           let arr =  this.goodsList.filter(item => item.isChecked)
         if(arr.length === 0) {
             return
         }
        let idArr = []
        arr.forEach(item => { idArr.push(item.goodsid) })
        let ids = idArr.join(',')
        let rsp = await removeCartGoods({goodsId: ids})
        if(rsp && rsp.code === 0) {
            // Toast.success('移除成功')
            dingdingToast('success','移除成功')
            this.getMyCart()
        }
        },
        allChecked() {
            if (!this.isCheckAll) {
                this.goodsList.forEach(item => {
                    this.$set(item, "isChecked", true)
                })
            } else {
                this.goodsList.forEach(item => {
                    this.$set(item, "isChecked", false)
                })
            }
        },
        toStore(id) {
            this.$router.push({path: '/store', query: { id }})
        },
        toGoods(id) {
            this.$router.push({path: '/goodsDetail', query: { id }})
        },
        toIndex() {
            this.$router.push('/')
        },
        remove(arr, val) {
        var index = arr.indexOf(val);
        if (index > -1) {
            arr.splice(index, 1);
        }
      }
    }
}
</script>

<style lang='scss' scoped>
.top {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    background-color: #ffffff;
    .header {
    .title {
        font-size: 18px;
        font-weight: 700;
    }
    .number {
        margin-top: 5px;
        font-size: 12px;
        color: #666666;
     }
   }
   .setting {
       color: #666;
   }
}

.content {
  /deep/ .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
  .cartGoods {
      padding: 10px;
      margin-bottom: 60px;
      .item {
        background-color: #ffffff;
        padding: 10px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .check {
            margin-right: 10px;
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
                width: 230px;
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
      } 
  }
  .toSee {
      margin-top: 10px;
      text-align: center;
  }
  .settleFooter {
      border-top: 1px solid #eeeeee;
      width: 100%;
      box-sizing: border-box;
      background-color: #ffffff;
      position: absolute;
      bottom: 50px;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      .check {
          flex: 1;
        /deep/ .van-checkbox__label {
            color: #999;
            font-size: 13px;
            padding-top: 3px;
        }  
      }
      .checkNum {
          margin-right: 20px;
          color: #666;
          .value {
              color: #ea501a;
          }
      }
  }

}
</style>