<template>
  <div class="container">
    <div class="search">
      <div class="typeList">
        <van-dropdown-menu active-color="#3296FA">
          <van-dropdown-item v-model="goods.searchType" :options="typeList" @change="pickedType" />
        </van-dropdown-menu>
      </div>
      <div class="searchInput">
        <van-search
          v-model="searchValue"
          placeholder="请输入搜索关键词"
          show-action
          shape="round"
          @search="onSearch"
        >
          <div slot="action" @click="onSearch">搜索</div>
        </van-search>
      </div>
    </div>
    <div class="searchHistory" v-if="localHistory.length > 0">
      <div class="historyName">
        <div class="title">历史搜索</div>
        <div class="del">
          <van-icon name="delete" @click="deleteHistory" />
        </div>
      </div>
      <div class="historyList">
        <van-tag
          color="#f2826a"
          style="margin: 3px;"
          size="medium"
          v-for="(item, index) in localHistory"
          :key="index"
          @click="pickTag(item)"
        >{{item}}</van-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from "vant"
import { mapState } from 'vuex'
import { dingdingToast } from '../../utils/utils.js'
export default {
  data() {
    return {
      searchValue: "",
      typeList: [
        { text: "找资源", value: 1 },
        { text: "找店铺", value: 2 }
      ],
      historyList: [],
      localHistory: []
    };
  },
  computed: {
    ...mapState(['goods'])
  },
  created() {
    this.searchValue = this.$route.query.value || ''
  },
  mounted() {
    if (localStorage.getItem("historySearchList")) {
      let list = localStorage.getItem("historySearchList").split(",");
      this.localHistory = [...new Set(list)];
    }
  },
  methods: {
    onSearch() {
      if (this.searchValue === "") {
        // Toast("请输入搜索关键词");
        dingdingToast('', '请输入搜索关键词')
      } else {
        this.historyList.push(this.searchValue);
        localStorage.setItem("historySearchList", this.historyList);
        this.$router.push({ path: '/searchlist', query: {value: this.searchValue, type: this.goods.searchType}})
      }
    },
    pickedType(value) {
      this.$store.commit('goods/changeSearchType', value)
    },
    deleteHistory() {
      localStorage.removeItem("historySearchList");
      this.localHistory = [];
    },
    pickTag(item) {
      this.searchValue = item;
      this.$router.push({ path: '/searchlist', query: {value: this.searchValue, type: this.goods.searchType}})
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background-color: #f5f5f5;
  height: 100vh;
  .search {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #ffffff !important;
   /deep/ .van-dropdown-menu__bar {
      box-shadow: none;
    }
    .typeList {
      flex: 1;
      border: none;
    }
    .searchInput {
      flex: 5;
    }
  }
  .searchHistory {
    margin: 20px;
    width: 90%;
    margin-left: 5%;
    .historyName {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .title {
        font-size: 14px;
      }
    }
    .historyList {
      display: flex;
      flex-direction: row;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 10px;
    }
  }
}
</style>