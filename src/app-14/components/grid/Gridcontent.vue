<template>
  <div class="gridcontent" @mouseover="resetGridView">
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
import { globalConfig } from '../../config/global.config'
import GridcellVue from './components/Gridcell.vue';
import mousemoveMixin from '../../mixins/mousemove.mixin';
export default {
  mixins: [mousemoveMixin],
  props: ['toolboxWidth', 'topmenuHeight'],
  components: {
    krtGridcell: GridcellVue
  },
  data() {
    return {
      gridCellHeight: globalConfig.gridCellHeight,
      gridCellWidth: globalConfig.gridCellWidth,
      gridColumns: globalConfig.gridColumns,
      gridRows: globalConfig.gridRows
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