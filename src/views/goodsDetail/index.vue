<template>
  <div class="box">
      <div class="content">
        <!-- 商品轮播图 -->
          <div class="banner" v-if="detailData.images.length > 0">
            <van-swipe :autoplay="5000" :stop-propagation="false" @change="onChange">
              <van-swipe-item v-for="(item, index) in detailData.images" :key="index" @click="previewImg = true">
                <img width="100%" height="300px" :src="item" :onerror="errorGoodsDefault"/>
              </van-swipe-item>
              <template #indicator v-if="detailData.images.length > 1">
              <div class="custom-indicator">
                {{ current + 1 }}/{{detailData.images.length}}
              </div>
            </template>
            </van-swipe>
            <van-image-preview v-model="previewImg" :images="detailData.images"></van-image-preview>
          </div>
          <img v-else width="100%" height="300px" :src="detailData.image" :onerror="errorGoodsDefault"/>
          <!-- 价格名称 -->
          <div class="price_name">
            <div class="price">{{detailData.price | priceFormat}}</div>
            <div class="name">
              {{detailData.name}}
            </div>
          </div>

          <!-- 资源信息 -->
          <div class="info">
            <div class="cell" v-if="detailData.advword">
              <div class="label">资源简介</div>
              <div class="value serviceJian"  @click="isShowServiceDetail = true">{{detailData.advword}}</div>
              <van-icon name="arrow" color="#999"/>
            </div>
            <div class="cell">
              <div class="label">服务时间</div>
              <div class="value">{{detailData.workingtime}}</div>
            </div>
            <div class="cell">
              <div class="label">联系人</div>
              <div class="value">{{detailData.contact}}</div>
            </div>
            <!-- <div class="cell">
              <div class="label">联系手机</div>
              <div class="value">{{detailData.phone}}</div>
            </div>
             <div class="cell">
              <div class="label">联系电话</div>
              <div class="value">{{detailData.tel}}</div>
            </div> -->
             <div class="cell">
              <div class="label">电子邮箱</div>
              <div class="value">{{detailData.email || '暂未填写'}}</div>
            </div>
          </div>

          <!-- 店铺信息 -->
          <div class="store">
            <div class="storeImg">
              <van-image v-if="detailData.mallstore.avatar"  width="48" height="48" round style="margin-right: 10px;"  :src="detailData.mallstore.avatar | imgFormat" :onerror="errorDefault"/>
              <van-image v-else width="48" height="48" round style="margin-right: 10px;" :src="require('../../assets/store.png')" />
            </div>
            <div class="storeInfo">
              <div class="name">{{detailData.mallstore.name}}</div>
              <div class="rate">
                <van-rate v-model="detailData.evaluationgoodstar" size="14px" />
              </div>
            </div>
            <div class="toStore">
              <van-button round color="linear-gradient(to right, #8bc4fd, #3296FA)" size="small" @click="toStore(detailData.mallstore.id)">进店逛逛</van-button>
            </div>
          </div>

          <!-- 资源详情 -->
          <van-divider v-if="detailData.description" :style="{ color: '#666', borderColor: '#999', padding: '0 100px' }">资源详情</van-divider>
          <div class="serviceDetail" v-html="detailData.description"></div>

          <!-- 资源推荐 -->
          <van-divider :style="{ color: '#ea501a', borderColor: '#ea501a', padding: '0 100px' }">资源推荐</van-divider>
          <Goods :goodsList="goodsList" />
      </div>
      <!-- 底部 -->
      <div class="footer">
        <van-goods-action> 
          <van-goods-action-icon icon="shop-o" color="#3296FA" text="店铺" @click="toStore(detailData.mallstore.id)" />
          <van-goods-action-icon icon="cart-o" text="购物车" @click="toCart" />
          <van-goods-action-button type="warning"  color="#8bc4fd" text="加入购物车" @click="addGoodsCart" />
          <van-goods-action-button
            type="danger"
            color="#3296FA"
            text="立即申请"
            @click="toBuy"
          />
        </van-goods-action>
      </div>

      <!-- 资源简介Dialog -->
      <van-dialog v-model="isShowServiceDetail" :showConfirmButton="false" :width="260" :closeOnClickOverlay="true" title="资源简介">
        <div class="serviceTell">
           {{detailData.advword}}
        </div>
      </van-dialog>

    <!-- 立即申请成功后Dialog -->
    <van-dialog v-model="isShowApply" title="提示" show-cancel-button cancelButtonText="再逛逛" confirm-button-text="查看订单" @confirm="toOrder" @cancel="toIndex">
        <div class="showApply">申请成功!</div>
    </van-dialog>
  </div>
</template>

<script>
import Goods from '../../components/goods'
import { getGoodsDetail, getGoodsList, addCart, toOrderGoods } from '../../api/goods'
import { BASEURL } from '../../utils/config'
import { Toast } from 'vant'
import {dingdingToast } from '../../utils/utils.js'
export default {
  components: { Goods },
    data() {
      return {
        detailData: null,
        goodsId: null,
        value: 5,
        previewImg: false,
        current: 0,
        isShowServiceDetail: false,
        searchConf: {
           currentPage: 1,
           pageSize: 10,
           verify: 1
        },
        goodsList: [],
        errorDefault: 'this.src="' + require('../../assets/store.png') + '"',
        errorGoodsDefault: 'this.src="' + require('../../assets/defaultGoods.png') + '"',
        isShowApply: false,
      }
    },
  created() {
      this.goodsId = this.$route.query.id
      this.getGoodsInfo()
      this.getRecommendList()
  },
  methods: {
    onChange(index) {
      this.current = index;
    },
   async addGoodsCart() {
     let data = {
       goodsId: this.goodsId,
       goodsNum: 1,
     }
      let rsp = await addCart(data)
      if(rsp && rsp.code === 0) {
        dingdingToast('成功添加到购物车')
      }
    },
   async toBuy() {
      let data = {
       goodsId: this.goodsId,
       goodsNum: 1,
     }
      let rsp = await toOrderGoods(data)
      if(rsp && rsp.code === 0) {
        // dingdingToast('申请成功')
        this.isShowApply = true
      }
     },
     toOrder() {
        this.$store.commit('goods/changeOrderTab', 0)
        this.$router.push('/order')
     },
     toIndex() {
       this.$router.push('/')
     },
     toCart() {
       this.$router.push('/cart')
     },
     toStore(id) {
       this.$router.push({path: '/store', query: {id}})
     },
    async getGoodsInfo() {
      let rsp = await getGoodsDetail(this.goodsId)
      if(rsp && rsp.code === 0) {
        this.detailData = rsp.data.data
        let imgArr = []
        if(rsp.data.data.images && rsp.data.data.images.length > 0) {
          rsp.data.data.images.forEach(item => {
            imgArr.push(BASEURL + item.url)
          })
        }
        this.detailData.images = imgArr
        this.detailData.image = BASEURL + this.detailData.image
      }
    },
    async getRecommendList() {
      let rsp = await getGoodsList(this.searchConf)
      if(rsp && rsp.code === 0) {
        this.goodsList = rsp.data.data.items
      }
    }
  }, 
  watch: {
    $route: {
      handler(route) {
        if (route.name === "goodsDetail") {
          location.reload();
        }
      },
      deep: true
    }
  }
}
</script>

<style lang='scss' scoped>
.box{
    background: #f5f5f5;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .footer {
      margin-top: 50px;
    }
    .serviceTell {
      padding: 10px;
      color: #666;
      font-size: 14px;
      text-align: center;
      min-height: 100px;
    }
    .showApply {
      padding: 15px 10px;
      text-align: center;
      font-size: 15px;
      color: #666;
    }
    .content {
        flex: 1;
        overflow: auto;
        .custom-indicator {
          position: absolute;
          right: 5px;
          bottom: 5px;
          padding: 2px 5px;
          font-size: 12px;
          background: rgba(0, 0, 0, 0.1);
          color: #ffffff;
        }
        .price_name {
          background-color: #ffffff;
          padding: 10px;
          .price {
            color: #ea501a;
            font-size: 17px;
          }
          .name {
            margin-top: 5px;
            font-weight: 700;
            font-size: 14px;
          }
        }
        .info {
          background-color: #ffffff;
          padding: 10px;
          margin-top: 10px;
          .cell {
            display: flex;
            align-items: center;
            margin: 10px 0;
            .label {
              color: #a7a4a4;
              font-size: 12px;
              width: 80px;
            }
            .value {
              color: #666;
              font-size: 14px;
            }
            .serviceJian {
              flex: 1;
              display: -webkit-box;
              overflow: hidden;
              white-space: normal;
              text-overflow: ellipsis;
              word-wrap: break-word;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
          }
        }
        .store {
          margin-top: 10px;
          display: flex;
          background-color: #ffffff;
          padding: 10px;
          justify-content: space-between;
          align-items: center;
          .storeInfo {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .name {
              font-size: 14px;
              color: #666;
            }
          }
          .toStore {
            margin-right: 20px;
          }
        }
        .serviceDetail {
          background-color: #ffffff;
          margin-bottom: 10px;
          padding: 10px;
          img {
            width: 100% !important;
          }
           p img {
            width: 100% !important;
          }
        }
    }
    
}
</style>