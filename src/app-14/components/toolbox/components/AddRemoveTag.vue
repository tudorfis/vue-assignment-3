<template>
  <div class="add-remove-tag" draggable="true" @dragstart="onDrag">
    <i class="fas fa-tags" :style="iStyle"></i>
    <label v-show="!isInsideCell">Add / Remove Tag</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
            toolboxService.startDrag(event, 'addremovetag')
        }
    },
    computed: {
        iStyle() {
            const extraStyle = { 'margin-top': '3px' }
            return toolboxService.setIconStyle(this.isInsideCell, extraStyle)
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
    font-size: 40px;
    color: white;
    margin-top: -5px;
  }
  label {
    font-size: 14px;
    color: white;
    line-height: 13px;
    margin-top: 8px;
  }
}
</style>