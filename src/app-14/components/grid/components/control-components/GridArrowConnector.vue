<template>
  <div id="grid-arrow-connector">
    <i
      draggable="true"
      class="fas fa-arrow-alt-circle-right icon-general"
      @dragstart.prevent="onDragstart"
    ></i>
    <i
      draggable="true"
      class="fas fa-arrow-alt-circle-down icon-split-no"
      :style="iconSplitNoStyle"
      @dragstart.prevent="onDragstart"
    ></i>
    <i
      draggable="true"
      class="fas fa-arrow-alt-circle-down icon-split-yes"
      :style="iconSplitYesStyle"
      @dragstart.prevent="onDragstart"
    ></i>
  </div>
</template>

<script>
import { globalConfig as gc } from '../../../../config/global.config';
import { gridArrowConnectorService } from '../../services/gridArrowConnector.service';
export default {
  computed: {
    styleIconTop() {
      return Math.floor(gc.gridCellElementHeight / 10);
    },
    styleIconLeftForSplitYes() {
      return Math.floor(gc.gridCellElementWidth / 3.5);
    },
    styleIconLeftForSplitNo() {
      return (
        Math.floor(gc.gridCellElementWidth / 3.5) * 2 +
        Math.floor(gc.gridCellElementWidth / 10)
      );
    },

    iconSplitNoStyle() {
      const { styleIconLeftForSplitNo, styleIconTop } = this;

      return {
        left: `-${styleIconLeftForSplitNo}px`,
        top: `${styleIconTop}px`
      };
    },
    iconSplitYesStyle() {
      const { styleIconLeftForSplitYes, styleIconTop } = this;

      return {
        left: `-${styleIconLeftForSplitYes}px`,
        top: `${styleIconTop}px`
      };
    }
  },
  methods: {
    onDragstart(event) {
      this.setSplitDrag(event)
      gridArrowConnectorService.startDrag();
    },
    setSplitDrag(event) {
      if (event && event.target) {
        const { classList } = event.target
        if (classList.contains('icon-split-no')) {
          this.setSplitNoDrag()
        }
        else if (classList.contains('icon-split-yes')) {
          this.setSplitYesDrag() 
        }
      }
    },
    setSplitNoDrag() {
      gridArrowConnectorService.isSplitNoDrag = true;
      gridArrowConnectorService.isSplitYesDrag = false;
    },
    setSplitYesDrag() {
      gridArrowConnectorService.isSplitYesDrag = true;
      gridArrowConnectorService.isSplitNoDrag = false;
    }
  },
  mounted() {
    gridArrowConnectorService.selectorId = 'grid-arrow-connector';
  }
};
</script>

<style lang="scss">
#grid-arrow-connector {
  position: fixed;
  display: none;
  z-index: 4;
  cursor: pointer;

  i {
    background: white;
    border-radius: 75%;

    &.icon-general {
      color: black;
    }
    &.icon-split-yes {
      color: greenyellow;
      position: absolute;
      left: -30px;
      top: 10px;
    }
    &.icon-split-no {
      color: red;
      position: absolute;
      left: -60px;
      top: 10px;
    }
  }
}
</style>