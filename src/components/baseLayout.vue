<template>
      <div id="container">
        <div class="header">
          <slot name="header"></slot>
        </div>
          <div class="content">
              <slot name="content"></slot>
          </div>
          <div class="footer">
              <tabbar />
          </div>
      </div>

</template>

<script>
import Tabbar from './tabbar.vue';
export default {
  components: { Tabbar },
};
</script>

<style lang="scss" scoped>
 #container{
    background: #f5f5f5;
    height: 100vh;
    font-size: 0.15rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .content {
        flex: 1;
        overflow: auto;
    }
    .footer{
      margin-top: 50px;
    }
}

</style>