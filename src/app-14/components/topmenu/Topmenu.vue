<template>
  <div 
    class="topmenu"
    @mouseover="grs.resetGridView()"
    :style="topmenuStyle"
  >
    <img src="src/app-14/assets/img/kartra-logo.png" :style="imgStyle">
    <krt-topmenu-controls></krt-topmenu-controls>
    <button class="btn btn-success btn-green">
      <i class="fas fa-check-circle"></i> Done &amp; Exit
    </button>
  </div>
</template>

<script>
import { globalConfig } from '../../config/global.config'
import TopmenuControlsVue from './components/TopmenuControls.vue';
import { globalResetsService } from '../../services/globalResets.service';
export default {
  components: {
    krtTopmenuControls: TopmenuControlsVue
  },
  computed: {
    topmenuStyle() {
      const gc = globalConfig
      return {
        display: 'grid',
        height: `${gc.topmenuHeight}px`,
        'grid-template-columns': `${gc.toolboxWidth + 15}px 1fr auto`
      }
    },
    imgStyle() {
      return {
        height: `${globalConfig.topmenuHeight - 10}px`,
        margin: `auto 10px`
      }
    }
  },
  data() {
    return {
      grs: globalResetsService
    }
  }
};
</script>

<style lang="scss" scoped>
.topmenu {
  position: fixed;
  width: 100%;
  z-index: 3;

  background: #444;
  color: white;
  display: flex;
  justify-content: space-between;

  img {
    width: auto;
  }
}
</style>