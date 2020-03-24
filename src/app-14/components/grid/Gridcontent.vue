<template>
  <div class="gridcontent">
    <!-- <input type="text" v-model="gridColumns"> -->
    <!-- <input type="text" v-model="gridRows"> -->

    <div class="gridlayout" :style="gridStyle">
      <krt-gridcell
        v-for="gridCellIndex in gridSize"
        :index="gridCellIndex"
        :total="gridSize"
        :cols="gridColumns"
        :rows="gridRows"
        :width="gridCellHeight"
        :height="gridCellWidth"
      ></krt-gridcell>
    </div>
  </div>
</template>

<script>
import GridcellVue from './components/Gridcell.vue';
export default {
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue
  },
  data() {
    return {
      gridCellHeight: 120,
      gridCellWidth: 120,
      gridColumns: 10,
      gridRows: 10
    };
  },
  computed: {
    gridStyle() {
      return {
        'grid-template-columns': `repeat(${this.gridColumns}, 1fr)`,
        'grid-template-rows': `repeat(${this.gridRows}, 1fr)`
      };
    },
    gridSize() {
      return this.gridColumns * this.gridRows;
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcontent {
  overflow: auto;
  padding: 30px;

  .gridlayout {
    display: grid;
  }
}
</style>