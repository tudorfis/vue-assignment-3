<template>
  <div class="automation" draggable="true" @dragstart="onDrag">
    <i class="fas fa-cogs"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Automation</label>
  </div>
</template>

<script>
import { toolboxDragService } from '../services/toolboxDrag.service'
import { toolboxElementsEnum } from '../enum/toolboxElements.enum';
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxDragService.startDrag(event, toolboxElementsEnum.AUTOMATION)
        }
    }
};
</script>

<style lang="scss" scoped>
.automation {
  background: gray;

  &.gridtool {
      box-shadow: 0px 0px 8px gray;
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