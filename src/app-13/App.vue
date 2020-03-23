<template>
  <app-paper width="600" height="600">
      <app-graph slot="graph"></app-graph>
  </app-paper>
</template>

<script>
import GraphVue from './components/graph/Graph.vue';
import PaperVue from './components/paper/Paper.vue';
export default {
  components: {
      appPaper: PaperVue,
      appGraph: GraphVue
  }
};
</script>

<style lang="scss" scoped></style>