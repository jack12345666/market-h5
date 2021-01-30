<template>
  <div class="box">
    <div class="header" v-if="goods.storeTarbar === 'introduce' || goods.storeTarbar === 'qualifications'">
        <van-image v-if="storeDetail.banner" width="100%" height="160" :src="storeDetail.banner | imgFormat" :onerror="errorDefault"/>
        <van-image v-else width="100%" height="160" :src="require('../../assets/defaultBanner.jpg')" />
    </div>
      <div class="content">
          <div v-if="isshowProducts && loadingData" class="product">
             <Category :categoryId='categoryId' :storeId="storeId"/>
          </div>
          <div v-if="isshowIntroduce" class="introduce">
            <div class="title">
              {{storeDetail.name}}
            </div>
           <div v-if="storeDetail.description" class="context" v-html="storeDetail.description"></div>
           <div v-else class="context">{{storeDetail.introduce}}</div>
          </div>
          <div v-if="isshowQulifications" class="qulifications">
            <div class="title">
              卖家资质
            </div>
             <div class="context" v-html="storeDetail.qualifications"></div>
          </div>
      </div>
      <div class="footer">
        <van-tabbar v-model="goods.storeTarbar"  active-color="#3296FA" @change="onTarbarChange">
        <van-tabbar-item @click="saleIntroduce">
           <!-- <span class="storeName">{{storeDetail.name}}</span> -->
            <template #icon>
              <img v-if="storeDetail.logo" :src="storeDetail.logo | imgFormat" style="width: 36px;height: 36px !important;"/>
              <img v-else :src="require('../../assets/store.png')" style="width: 48px;height: 48px !important;"/>
            </template>
        </van-tabbar-item>
        <van-tabbar-item name='introduce' icon="bullhorn-o" @click="saleIntroduce">卖家介绍</van-tabbar-item>
        <van-tabbar-item name='products' icon="bag-o" @click="allProducts">全部产品</van-tabbar-item>
        <van-tabbar-item name='qualifications' icon="user-o" @click="saleQulifications">卖家资质</van-tabbar-item>
      </van-tabbar>
      </div>
  </div>
</template>

<script> 
import Category from '../../components/category'
import { storeDetail } from '../../api/goods'
import { dingdingTitle } from '../../utils/utils'
import { mapState } from 'vuex'
export default {
  components: { Category },
    data() {
      return {
        isshowIntroduce: true,
        isshowProducts: false,
        isshowQulifications: false,
        storeId: null,
        storeDetail: null,
        categoryId: null,
        loadingData: false,
        errorDefault: 'this.src="' + require('../../assets/defaultBanner.jpg') + '"'
      }
    },
    computed: {
      ...mapState(['goods'])
    },
    created() {
      this.storeId = this.$route.query.id 
      this.getStoreDetail()
      if(this.goods.storeTarbar === 'products') {
          this.isshowProducts = true
          this.isshowIntroduce = false
          this.isshowQulifications = false
      }else if(this.goods.storeTarbar === 'introduce') {
          this.isshowProducts = false
          this.isshowIntroduce = true
          this.isshowQulifications = false
      }else if(this.goods.storeTarbar === 'qualifications') {
        this.isshowProducts = false
        this.isshowIntroduce = false
        this.isshowQulifications = true
      }
    },
    methods: {
      onTarbarChange(index) {
        this.$store.commit('goods/changeStoreTarbar', index)
      },
      allProducts() {
        this.$store.commit('goods/changeStoreTarbar', 'products')
        this.isshowProducts = true
        this.isshowIntroduce = false
        this.isshowQulifications = false
      },
      saleIntroduce() {
        this.$store.commit('goods/changeStoreTarbar', 'introduce')
        this.isshowProducts = false
        this.isshowIntroduce = true
        this.isshowQulifications = false
      },
      saleQulifications() {
        this.$store.commit('goods/changeStoreTarbar', 'qualifications')
        this.isshowProducts = false
        this.isshowIntroduce = false
        this.isshowQulifications = true
      },
      async getStoreDetail() {
        let rsp = await storeDetail(this.storeId)
        if(rsp && rsp.code === 0) {
          this.storeDetail = rsp.data.data
          this.categoryId = this.storeDetail.categorys[0].commoncategoryid
          this.$store.commit('goods/changeCategoryId', this.categoryId)
          this.loadingData = true
          // document.title = this.storeDetail.name || '店铺详情'
          dingdingTitle('店铺详情')
        }
      }
    }
}
</script>

<style lang='scss' scoped>
.box{
    background: #ffffff;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .content {
        flex: 1;
        overflow: auto;
        .title {
          background-color: #ffffff;
          padding: 5px 10px;
          color: #666;
          border-bottom: 1px solid #ebe7e7;
        }
        .context {
          padding:0 10px;
         img {
            width: 100% !important;
          }
        }
    }
    .footer{
      margin-top: 50px;
      .storeName {
        color: #666;
        width: 70px;
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
</style>