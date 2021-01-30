<template>
  <div class="box">
      <div class="header">
        <van-search
          @focus="onFocus"
          placeholder="请输入搜索关键词"
          shape="round"
        />
        <div class="category">
            <div class="sub" >
            <!-- <van-dropdown-menu active-color="#3296FA" v-if="type === 0"> -->
            <van-dropdown-menu active-color="#3296FA">
               <van-dropdown-item v-model="subCategory" :options="typeList" @change="pickedType" />
            </van-dropdown-menu> 
          </div>
          <div class="numSort">
               <div class="name">成交量</div>
               <van-icon name="ascending" :color="numSort ? '#ea501a' : ''" size="17px" @click="changeNumSort"/>
          </div>
          <div class="timeSort">
              <div class="name">上线时间</div>
              <van-icon name="ascending" :color="timeSort ? '#ea501a' : ''" size="17px" @click="changeTimeSort"/>
         </div>
        <div class="select" @click="toSelect">
            <div class="name">筛选</div>
            <van-icon name="filter-o" size="17px" />
        </div>
        </div>
      </div>
      <div class="content" id="content">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
         <van-list
            v-model="loading"
            :finished="finished"
            :immediate-check='false'
            finished-text="没有更多了"
            @load="onLoad"
            >
             <div class="searchList">
                <div class="item" v-for="item in searchList" :key="item.id" @click="toDetail(item.id)">
                    <div class="img">
                        <van-image width="100" height="100" :src="item.image | imgFormat" />
                    </div>
                    <div class="info">
                        <div class="name">{{item.name}}</div>
                        <div class="price">{{item.price | priceFormat}}</div>
                        <div class="store">{{item.storename}}</div>
                    </div>
                </div>
          </div>
        </van-list>
    </van-pull-refresh>
        <van-empty
        v-if="searchList.length === 0"
            class="custom-image"
            image="https://img.yzcdn.cn/vant/custom-empty-image.png"
            description="暂无相关资源"
            />

        <back-top @backtop="backTop" :visible="backToTop" :bottom='30'></back-top>
      </div>

      <van-popup v-model="isShowSelect" position="right" round :style="{ width: '80%', height: '100%' }">
         <div class="selectBox">
             <div class="item">
                   <div class="first" style="display: flex;justify-content: space-between;align-items: center;">
                    <div class="title">服务对象</div>
                    <van-icon name="close" color="#999" size="24px" @click="isShowSelect = false"/>
                 </div>
                 <div class="tagList">
                    <van-tag v-for="(item, index) in serviceObj" :class="item.isChecked ? 'checked' : 'unchecked'" plain round size="large" :key="item.id" @click="checkObj(item, index)">{{item.name}}</van-tag>
             </div>
             </div>
             <div class="item">
                 <div class="title">机构规模</div>
                 <div class="tagList">
                     <van-tag v-for="(item, index) in orgList" :class="item.isChecked ? 'checked' : 'unchecked'" plain round size="large" :key="item.id" @click="checkOrg(item, index)">{{item.name}}</van-tag>
                 </div>
             </div>
             <div class="item">
                 <div class="title">资源类型</div>
                 <div class="tagList">
                      <van-tag v-for="(item, index) in serviceMode" :class="item.isChecked ? 'checked' : 'unchecked'" plain round size="large" :key="item.id" @click="checkType(item, index)">{{item.name}}</van-tag>
                 </div>
             </div>
             <div class="item">
                 <div class="title">收费模式</div>
                 <div class="tagList">
                    <van-tag v-for="(item, index) in moneyMode" :class="item.isChecked ? 'checked' : 'unchecked'" plain round size="large" :key="item.id" @click="checkMode(item, index)">{{item.name}}</van-tag>
                 </div>
             </div>
         </div>
         <div class="footer">
             <van-button round size="small" style="margin-right: 20px;" @click="reset">重置</van-button>
             <van-button round size="small" color="#3296FA" @click="submit">确认</van-button>
         </div>
      </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { getGoodsList } from '../../api/goods'
import BackTop from '../../components/backTop'
import { dingdingTitle, dingdingToast } from '../../utils/utils'
export default {
    components: { BackTop },
    data() {
        return {
        subCategory: '',
           typeList: [{ text: '全部', value: '' }],
           serviceObj: [],
           orgList: [],
           serviceMode: [
               { id: 0, name: '公共资源', isChecked: false },
               { id: 1, name: '专业资源', isChecked: false },
           ],
           moneyMode: [],
           numSort: false,
           timeSort: false, 
           isShowSelect: false,
           searchList: [],
           firstId: null,
           searchValue: '',
           loading: false,
           finished: false,
           refreshing: false,
           selectObj: {
               currentPage: 1,
               pageSize: 10,
               verify: 1,
               storeid: null,
               name: '',
               storename: '',
               isGgfw: null,
               isZyfw: null,
               orderStr: null
           },
            backToTop: false,
        }
    },
    computed: {
        ...mapState(['goods'])
    },
    created() {
        if(this.$route.query.id) {
            localStorage.setItem('firstId', this.$route.query.id)
        }
        if(this.$route.query.name) {
            dingdingTitle(this.$route.query.name)
        }else {
            dingdingTitle('资源超市')
        }
        this.firstId = +localStorage.getItem('firstId') || null
        let arr = this.goods.menuList.filter(item => item.id === this.firstId)
        arr[0].items.forEach(item => {
            this.typeList.push({
                text: item.name,
                value: item.id
            })
        })
        let serviceObj = this.goods.serviceObj
        serviceObj.forEach(item => {
            this.serviceObj.push({
                id: item.id,
                name: item.name,
                isChecked: false
            })
        })
        let orgList = this.goods.orgList
        orgList.forEach(item => {
            this.orgList.push( {
                id: item.id,
                name: item.name,
                isChecked: false
            })
        })
        let moneyMode = this.goods.chargeMode
        moneyMode.forEach(item => {
            this.moneyMode.push({
                id: item.id,
                name: item.name,
                isChecked: false
            })
        })
        this.getFirstSelectList()
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
      if (scrollTop > 100) {
        this.backToTop = true
      } else {
        this.backToTop = false
      }
     },
    toDetail(id) {
        this.$router.push({path: '/goodsDetail', query: {id}})    
    },
    onFocus() {
      this.$router.push({ path: '/search', query: {value: this.searchValue}})
    },
      onLoad() {
          this.getMoreSelectList()
      },
      onRefresh() {
        this.finished = false;
        this.refreshing = true
        this.selectObj.currentPage = 1
        this.getFirstSelectList()
      },
      async getFirstSelectList() {
          this.selectObj.currentPage = 1
          this.selectObj['categorys[0].commoncategoryids'] = this.firstId
          let rsp = await getGoodsList(this.selectObj)
          if(rsp && rsp.code === 0) {
              this.searchList = rsp.data.data.items
              this.refreshing = false
          }
      },
      async getMoreSelectList() {
          this.selectObj.currentPage ++
          let rsp = await getGoodsList(this.selectObj)
           if(rsp.data.data.items.length < 10) {
              this.searchList = this.searchList.concat(rsp.data.data.items)
              this.loading = false
              this.finished = true
          }else {
              this.searchList = this.searchList.concat(rsp.data.data.items) 
              this.loading = false
          }
      },
      reset() {
          this.serviceObj.forEach(item => {
              return item.isChecked = false
          })
          this.orgList.forEach(item => {
              return item.isChecked = false
          })
          this.serviceMode.forEach(item => {
              return item.isChecked = false
          })
          this.moneyMode.forEach(item => {
              return item.isChecked = false
          })
          this.selectObj['categorys[1].commoncategoryids'] = ''
          this.selectObj['categorys[2].commoncategoryids'] = ''  
          this.selectObj['categorys[3].commoncategoryids'] = ''
          this.selectObj.isGgfw = ''
          this.selectObj.isZyfw = ''
      },
      submit() {
          let serviceObj = this.serviceObj.filter(item => item.isChecked === true)
          let orgList = this.orgList.filter(item => item.isChecked === true)
          let serviceMode = this.serviceMode.filter(item => item.isChecked === true)
          let moneyMode = this.moneyMode.filter(item => item.isChecked === true)
          if(serviceObj.length === 1) {
              this.selectObj['categorys[1].commoncategoryids'] = serviceObj[0].id
          } 
          if(orgList.length === 1) {
              this.selectObj['categorys[2].commoncategoryids'] = orgList[0].id
          } 
         if(serviceMode.length === 1) {
             if(serviceMode[0].id === 0){
                this.selectObj.isGgfw = 1
                this.selectObj.isZyfw = ''
             }
             if(serviceMode[0].id === 1) {
                 this.selectObj.isZyfw = 1
                 this.selectObj.isGgfw = ''
             }
          } 
          if(moneyMode.length === 1) {
             this.selectObj['categorys[3].commoncategoryids'] = moneyMode[0].id
          }
          this.isShowSelect = false
          this.getFirstSelectList()
      },
      pickedType(value) {
          this.subCategory = value
          this.selectObj['categorys[4].commoncategoryids'] = this.subCategory
          this.getFirstSelectList()
      },
      changeNumSort() {
        this.numSort = !this.numSort
        if(this.numSort) {
            this.timeSort = false
        }
        this.selectObj.orderStr = this.numSort ? 'salenum asc' : 'salenum desc'
         this.getFirstSelectList()
      },
      changeTimeSort() {
         this.timeSort = !this.timeSort 
         if(this.timeSort) {
             this.numSort = false
         }
         this.selectObj.orderStr = this.timeSort ? 'addtime asc' : 'addtime desc'
         this.getFirstSelectList()

      },
      toSelect() {
        this.isShowSelect = true
      },
      checkObj(item, index) {
          item.isChecked = !item.isChecked
          let arr = []
          this.serviceObj.forEach(i => {
              arr.push({
                  id: i.id,
                  name: i.name,
                  isChecked: false
              })
          })
          this.serviceObj = arr
          if(!item.isChecked) {
             this.selectObj['categorys[1].commoncategoryids'] = '' 
          }
          this.serviceObj[index] = item 
      },
      checkOrg(item, index) {
          item.isChecked = !item.isChecked
          let arr = []
          this.orgList.forEach(i => {
              arr.push({
                  id: i.id,
                  name: i.name,
                  isChecked: false
              })
          })
          this.orgList = arr
          if(!item.isChecked) {
             this.selectObj['categorys[2].commoncategoryids'] = '' 
          }
          this.orgList[index] = item 
      },
      checkType(item, index) {
          item.isChecked = !item.isChecked
          let arr = []
          this.serviceMode.forEach(i => {
              arr.push({
                  id: i.id,
                  name: i.name,
                  isChecked: false
              })
          })
          this.serviceMode = arr
          if(!item.isChecked) {
            this.selectObj.isGgfw = ''
            this.selectObj.isZyfw = ''
          }
          this.serviceMode[index] = item 
      },
      checkMode(item, index) {
          item.isChecked = !item.isChecked
          let arr = []
          this.moneyMode.forEach(i => {
              arr.push({
                  id: i.id,
                  name: i.name,
                  isChecked: false
              })
          })
          this.moneyMode = arr
          if(!item.isChecked) {
             this.selectObj['categorys[3].commoncategoryids'] = '' 
          }
          this.moneyMode[index] = item 
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
    .header {
        .category {
            display: flex;
            align-items: center;
            background-color: #ffffff;
            padding: 0 10px;
            height: 40px;
            /deep/ .van-dropdown-menu__bar {
              box-shadow: none;
              height: 40px;
            }
           /deep/ .van-dropdown-menu__title {
               color: #666;
               font-size: 14px;
               padding-top: 3px;
            /deep/ .van-ellipsis {
              max-width: 80px;
              display: -webkit-box;
              overflow: hidden;
              white-space: normal;
              text-overflow: ellipsis;
              word-wrap: break-word;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
            }
            }
            .numSort {
                color: #666;
                font-size: 14px;
                display: flex;
                align-items: center;
                margin: 0 20px;
                .name {
                    margin-right: 5px;
                }
            }
            .timeSort {
                flex: 1;
                color: #666;
                font-size: 14px;
                display: flex;
                align-items: center;
                .name {
                    margin-right: 5px;
                }
            }
            .select {
                color: #666;
                font-size: 14px;
                display: flex;
                align-items: center;
                .name {
                    margin-right: 5px;
                }
            }
        }
    }
    .content {
        flex: 1;
        overflow: auto;
        padding: 10px 0;
       /deep/  .custom-image .van-empty__image {
            width: 90px;
            height: 90px;
        }
        .searchList {
            padding: 0 10px;
            background-color: #ffffff;
            .item {
                display: flex;
                padding: 5px 0;
                // border-bottom: 1px solid #f1ecec;
                .img {
                    margin-right: 10px;
                }
                .info {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    // padding: 5px 0;
                    .name {
                        font-size: 15px;
                        display: -webkit-box;
                        overflow: hidden;
                        white-space: normal;
                        text-overflow: ellipsis;
                        word-wrap: break-word;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                    }
                    .price {
                        color: #ea501a;
                        font-size: 15px;
                        margin-top: 20px;
                    }
                    .store {
                        color: #999;
                        font-size: 12px;
                        margin-bottom: 5px;
                    }
                }
            }
        }
    }
    .selectBox {
        padding: 20px 10px 10px 10px;
        .item {
            .title {
                color: #666;
                font-size: 15px;
            }
            .tagList {
                margin: 10px 0;
                .checked {
                    color: #3296FA;
                    margin: 5px;
                }
                .unchecked {
                    margin: 5px;
                }
            }
        }
    }
    .footer {
        position: absolute;
        bottom: 20px;
        left: 30%;

    }
}
</style>