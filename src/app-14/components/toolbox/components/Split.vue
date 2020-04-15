<template>
  <div class="split" draggable="true" @dragstart="onDrag">
    <i class="fas fa-random"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Split</label>
  </div>
</template>

<script>
import { toolboxDragService } from '../services/toolboxDrag.service'
import { toolboxElementsEnum } from '../enum/toolboxElements.enum';
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxDragService.startDrag(event, toolboxElementsEnum.SPLIT)
        }
    }
};
</script>

<style lang="scss" scoped>
.split {
  background: mediumvioletred;

  &.gridtool {
      box-shadow: 0px 0px 8px mediumvioletred;
  }
  i {
    color: white;
  }
  label {
    font-size: 14px;
    color: white;
  }
}
</style>