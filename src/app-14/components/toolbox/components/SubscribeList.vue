<template>
  <div class="subscribe-list" draggable="true" @dragstart="onDrag">
    <i class="fas fa-users"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">(Un)Subscribe List</label>
  </div>
</template>

<script>
import { toolboxDragService } from '../services/toolboxDrag.service'
import { toolboxElementsEnum } from '../enum/toolboxElements.enum';
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxDragService.startDrag(event, toolboxElementsEnum.SUBSCRIBE_LIST)
        }
    }
};
</script>

<style lang="scss" scoped>
.subscribe-list {
  background: lightseagreen;

  &.gridtool {
      box-shadow: 0px 0px 8px lightseagreen;
  }
  i {
    color: white;
    margin-top: -3px;
  }
  label {
    font-size: 14px;
    color: white;
    line-height: 13px;
    margin-top: 8px;
  }
}
</style>