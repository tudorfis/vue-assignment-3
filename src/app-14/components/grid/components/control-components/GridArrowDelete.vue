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
import { gridDeleteService } from '../../services/gridDelete.service'
export default {
  methods: {
    deleteLink() {
      gridDeleteService.deleteLink()
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