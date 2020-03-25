<template>
  <div class="topmenu" @mouseover="resetGridView">
    <img src="src/app-14/assets/img/kartra-logo.png">
    <button class="btn btn-success btn-green">
      <i class="fas fa-check-circle"></i> Done &amp; Exit
    </button>
  </div>
</template>

<script>
import mousemoveMixin from '../../mixins/mousemove.mixin'
export default {
  mixins: [mousemoveMixin],
};
</script>

<style lang="scss" scoped>
.topmenu {
  position: fixed;
  width: 100%;
  height: 60px;
  z-index: 2;

  background: #444;
  color: white;
  display: flex;
  justify-content: space-between;

  img {
    height: 50px;
    width: auto;
    margin: auto 10px;
  }
  
  
}
</style>