<template>
  <div 
    id="arrow-delete"
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
  }
}
</script>

<style lang="scss">
    #arrow-delete {
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