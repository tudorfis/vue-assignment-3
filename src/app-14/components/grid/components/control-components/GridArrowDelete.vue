<template>
  <div 
    id="grid-arrow-delete"
    draggable="false"
    @click="deleteLink"
  >
    <i class="fas fa-minus-circle fa-fill"></i>
  </div>
</template>

<script>
import { gridDeleteArrowService } from '../../services/gridDeleteArrow.service'
export default {
  methods: {
    deleteLink() {
      gridDeleteArrowService.deleteLink()
    }
  },
  mounted() {
    gridDeleteArrowService.selectorId = 'grid-arrow-delete'
  }
}
</script>

<style lang="scss">
    #grid-arrow-delete {
        position: fixed;
        display: none;
        z-index: 2;
        cursor: pointer;
        color: red;
        background: white;

        i {
            position: relative;
        }
    }
</style>