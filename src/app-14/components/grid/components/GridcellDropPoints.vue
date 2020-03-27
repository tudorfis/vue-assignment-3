<template>
  <div
    class="drop-between-points" 
    v-show="display !== false">
    <transition name="point-animation" mode="out-in">
      <div
        class="drop-point drop-top"
        :style="{...pointStyle, ...topPointStyle}"
        v-show="display.showTop"
      >&nbsp;</div>
    </transition>
    <transition name="point-animation" mode="out-in">
      <div 
        class="drop-point drop-right"
        :style="{...pointStyle, ...rightPointStyle}"
        v-show="display.showRight"
      >&nbsp;</div>
    </transition>
    <transition name="point-animation" mode="out-in">
      <div 
        class="drop-point drop-bottom"
        :style="{...pointStyle, ...bottomPointStyle}"
        v-show="display.showBottom"
      >&nbsp;</div>
    </transition>
    <transition name="point-animation" mode="out-in">
      <div 
        class="drop-point drop-left"
        :style="{...pointStyle, ...leftPointStyle}"
        v-show="display.showLeft"
      >&nbsp;</div>
    </transition>
  </div>
</template>

<script>
import { globalConfig } from '../../../config/global.config';
export default {
  props: ['display'],
  computed: {
    pointDimension() {
        return globalConfig.droppointDimension
    },
    halfPointDimension() {
        return Math.round(this.pointDimension / 2)
    },
    halfCellWidth() {
        return Math.round(globalConfig.gridCellWidth / 2)
    },
    halfCellHeight() {
        return Math.round(globalConfig.gridCellHeight / 2)
    },
    pointStyle() {
      return {
        width: `${this.pointDimension}px`,
        height: `${this.pointDimension}px`,
        'border-radius': `${this.halfPointDimension}px`
      };
    },
    topPointStyle() {
      return {
        top: `-${this.halfPointDimension}px`,
        left: `${this.halfCellWidth - this.halfPointDimension}px`
      };
    },
    rightPointStyle() {
      const top = this.halfCellHeight - this.halfPointDimension;
      const left = globalConfig.gridCellWidth - this.halfPointDimension;
      return {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    bottomPointStyle() {
      const top = globalConfig.gridCellHeight - this.halfPointDimension;
      const left = this.halfCellWidth - this.halfPointDimension;
      return {
        top: `${top}px`,
        left: `${left}px`
      };
    },
    leftPointStyle() {
      const top = this.halfCellHeight - this.halfPointDimension;
      return {
        top: `${top}px`,
        left: `-${this.halfPointDimension}px`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.drop-between-points {
  position: absolute;
  top: 0;
  left: 0;

  .drop-point {
    position: absolute;
    background: yellow;
    border: 5px solid red;
    box-shadow: 1px 1px 15px #ccc;
  }
}

.point-animation-enter {
  opacity: 0;
}
.point-animation-enter-active {
  transition: opacity .7s;
}
.point-animation-leave {
}
.point-animation-leave-active {
  transition: opacity .2s;
  opacity: 0;
}
</style>