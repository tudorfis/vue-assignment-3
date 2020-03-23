<template>
  <div class="gridlayout">
    <krt-gridcell
      v-for="n in nrGridCells"
      :width="gridCellHeight"
      :height="gridCellWidth"
    ></krt-gridcell>
  </div>
</template>

<script>
import GridcellVue from './components/Gridcell.vue'
export default {
  components: {
    krtGridcell: GridcellVue
  },
  data() {
    return {
      gridCellHeight: 120,
      gridCellWidth: 120,
      nrGridCells: 0,
      resizeInProgress: false
    }
  },
  methods: {
    buildGrid() {
      
      this.resizeInProgress = true

      const width = (window.innerWidth - 200)
      const height = (window.innerHeight - 50)

      this.nrGridCells = 
        Math.floor(width / this.gridCellHeight) *
        Math.floor(height / this.gridCellWidth)

      const gridlayout = document.querySelector('.gridlayout')

      gridlayout.style.width = `${width - (width % this.gridCellWidth) + 1}px`
      gridlayout.style.height = `${height - (height % this.gridCellHeight) + 1}px`

      this.resizeInProgress = false
    }
  },
  mounted() {
    const vm = this;
    this.buildGrid()
    
    window.addEventListener('resize', event => {
      if (!this.resizeInProgress) {
        setTimeout(_ => {
          vm.buildGrid.call(vm)
        }, 1000)
      }
    });
  }
}
</script>

<style lang="scss" scoped>
  .gridlayout {
    margin: 30px auto;
    display: flex;
    flex-wrap: wrap;
    border-left:  1px solid #e0e0e0;
    border-top:  1px solid #e0e0e0;

    .gridcell {
      border-right: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
    }
  }
</style>