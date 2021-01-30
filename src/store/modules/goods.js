const state = {
    menuList: [], // 首页八大类(包含下面二级筛选)
    serviceObj: [], // 服务对象筛选项
    orgList: [], // 机构规模筛选项
    serviceType: [], // 资源类型筛选项
    chargeMode: [], // 收费模式
    orderTab: 0, // 订单tab
    searchType: 1, // 搜索类型 1:找资源 2:找店铺 
    storeTarbar: 'introduce',
    storeScroll: 0,
    categoryId: null,
  
}

const actions = {

}

const mutations = {
    changeMenuList(state, payload) {
        state.menuList = payload
    },
    changeServiceObj(state, payload) {
        state.serviceObj = payload
    },
    changeOrgList(state, payload) {
        state.orgList = payload
    },
    changeServiceType(state, payload) {
        state.serviceType = payload
    },
    changeChargeMode(state, payload) {
        state.chargeMode = payload
    },
    changeOrderTab(state, payload) {
        state.orderTab = payload
    },
    changeSearchType(state, payload) {
        state.searchType = payload
    },
    changeStoreScroll(state, payload) {
        state.storeScroll = payload
    },
    changeStoreTarbar(state, payload) {
        state.storeTarbar = payload
    },
    changeCategoryId(state, payload) {
        state.categoryId = payload
    }
}

export default {
    namespaced: true,
    state,
    actions,
    mutations
}