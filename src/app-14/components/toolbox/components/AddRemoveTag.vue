<template>
  <div class="add-remove-tag" draggable="true" @dragstart="onDrag">
    <i class="fas fa-tags"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Add / Remove Tag</label>
  </div>
</template>

<script>
import { toolboxDragService } from '../services/toolboxDrag.service'
import { toolboxElementsEnum } from '../enum/toolboxElements.enum';
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
            toolboxDragService.startDrag(event, toolboxElementsEnum.ADD_REMOVE_TAG)
        }
    }
  };
</script>

<style lang="scss" scoped>
.add-remove-tag {
  background: magenta;

  &.gridtool {
      box-shadow: 0px 0px 5px magenta;
  }
  i {
    color: white;
  }
  label {
    font-size: 14px;
    color: white;
    line-height: 13px;
    margin-top: 8px;
  }
}
</style>