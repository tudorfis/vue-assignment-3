<template>
  <div class="go-to" draggable="true" @dragstart="onDrag">
    <i class="fas fa-directions"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">Go To</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxService.startDrag(event, 'go_to')
        }
    }
};
</script>

<style lang="scss" scoped>
.go-to {
  background: black;

  &.gridtool {
      box-shadow: 0px 0px 8px black;
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