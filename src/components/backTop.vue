<template>
    <transition name="mine-backtop">
        <div class="mine-backtop" :style="{bottom: bottom + 'px'}" v-show="visible" @click="backToTop">
           <van-icon name="arrow-up" color="#000"/>
        </div>
    </transition>
</template>

<script>
export default {
    name: "backTop",
    props:{
       visible:{
           type: Boolean,
           default: false
       },
       bottom: {
           type: Number,
           default: 70
       }
    },
    methods:{
        backToTop(){
            this.$emit("backtop"); 
        }
    }
}
</script>

<style lang="scss" scoped>
    .mine-backtop{
        overflow:hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction:row;
        box-shadow: 0 0 5px rgba(0,0,0,.05);
        width: 36px;
        height: 36px;
        background-color: #ffffff;
        border-radius: 50%;
    }
    .mine-backtop{
      position: absolute;
      bottom: 70px;
      right: 15px;
        &-enter-active,
        &-leave-active{
            transition:opacity 0.4s;
        }
        &-enter,
        &-leave-to{
            opacity:0;
        }
    }
</style>