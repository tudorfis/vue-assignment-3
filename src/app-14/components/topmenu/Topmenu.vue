<template>
  <div class="topmenu" @mouseover="resetGridView" :style="topmenuStyle">
    <img src="src/app-14/assets/img/kartra-logo.png" :style="imgStyle">
    <button class="btn btn-success btn-green">
      <i class="fas fa-check-circle"></i> Done &amp; Exit
    </button>
  </div>
</template>

<script>
import mousemoveMixin from '../../mixins/mousemove.mixin'
import { globalConfig } from '../../config/global.config'
export default {
  mixins: [mousemoveMixin],
  computed: {
    topmenuStyle() {
      return {
        height: `${globalConfig.topmenuHeight}px`
      }
    },
    imgStyle() {
      return {
        height: `${globalConfig.topmenuHeight - 10}px`,
        margin: `auto 10px`
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.topmenu {
  position: fixed;
  width: 100%;
  z-index: 2;

  background: #444;
  color: white;
  display: flex;
  justify-content: space-between;

  img {
    width: auto;
  }
}
</style>