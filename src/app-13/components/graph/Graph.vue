<template>
  <div
    id="graph"
    @mousedown="onStartMoving"
    @mouseup="onStopMoving"
    @mousemove="movePosition"></div>
</template>

<script>
import movePositionMixin from './graph-mixins/movePosition.mixin';

export default {
  mixins: [movePositionMixin],
  data() {
      return {
          graphModel: new joint.dia.Graph(),
      }
  },
};
</script>

<style lang="scss" scoped>
#graph {
  border: 2px solid #000;
}
</style>