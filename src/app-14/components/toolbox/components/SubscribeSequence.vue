<template>
  <div class="subscribe-sequence" draggable="true" @dragstart="onDrag">
    <i class="fas fa-network-wired"></i>
    <div class="clear"></div>
    <label v-show="!isInsideCell">(Un)Subscribe Sequence</label>
  </div>
</template>

<script>
import { toolboxService } from '../services/toolbox.service'
export default {
    props: ['isInsideCell'],
    methods: {
        onDrag(event) {
          toolboxService.startDrag(event, 'subscribesequence')
        }
    }
};
</script>

<style lang="scss" scoped>
.subscribe-sequence {
  background: lightcoral;

  &.gridtool {
      box-shadow: 0px 0px 8px lightcoral;
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