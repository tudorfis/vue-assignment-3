<template>
  <div class="col-sm-6 col-md-4 col-lg-3">
    <div
      class="panel panel-default"
      @mouseover="showDeleteIcon = true"
      @mouseleave="showDeleteIcon = false"
    >
      <div class="panel-body quote">
        <slot></slot>
      </div>
      <img
        v-if="showDeleteIcon"
        src="./assets/delete-icon.png" 
        class="icon">
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showDeleteIcon: false
    };
  }
};
</script>

<style>
.panel-body {
  font-family: 'Arizonia', cursive;
  font-size: 24px;
  color: lightseagreen;
  text-align: center;
}
.panel {
  cursor: pointer;
}
.panel:hover {
  background-color: rgb(255, 247, 247);
}
img.icon {
  position: absolute;
  right: 10px;
  top: -5px;
  background: white;
  border-radius: 15px;
  padding: 0;
  width: 25px;
  height: 25px;
}
</style>