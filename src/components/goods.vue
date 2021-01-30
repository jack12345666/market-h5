<template>
  <div class="all">
     <div class="goodsItem" v-for="item in goodsList" :key="item.id" @click="toGoodsDetail(item.id)">
        <div class="goodsImg">
            <img v-if="item.image" width="100%" id="img" style=" border-top-left-radius: 8px;border-top-right-radius: 8px;height: 160px;" :onerror="errorDefault" :src="item.image | imgFormat" />
            <img v-else width="100%" style="border-top-left-radius: 8px;border-top-right-radius: 8px;height: 160px;" :src="require('../assets/defaultGoods.png')" />
        </div>
        <div class="goodsName">
            {{item.name}}
        </div>
        <div class="price">
          {{item.price | priceFormat}}
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        goodsList: {
            type: Array,
            default: function() {
                return []
            },
        }
    },
    data() {
        return {
          errorDefault: 'this.src="' + require('../assets/defaultGoods.png') + '"'
        }
    },
    methods: {
      toGoodsDetail(id) {
        this.$router.push({ path: '/redirect/goodsDetail', query: { id }})
      }
    }
}
</script>

<style lang='scss' scoped>
 .all {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
    .goodsItem:nth-child(odd) {
      width: calc(50% - 5px);
      margin-right: 5px;
    }
    .goodsItem:nth-child(even)  {
      width: calc(50% - 5px);
      margin-left: 5px;
    }
    .goodsItem {
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      background: #ffffff;
      width: 50%;
      margin-bottom: 10px;
      border-radius: 8px;
      flex-direction: column;
      .goodsName {
        margin-left: 10px;
        color: #333333;
        display: -webkit-box;
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
        word-wrap: break-word;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .price {
        padding: 10px 0 10px 10px;
        color: red;
      }
     }
  }

     
</style>