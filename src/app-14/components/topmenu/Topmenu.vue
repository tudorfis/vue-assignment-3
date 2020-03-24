<template>
  <div class="topmenu">
    <img src="src/app-14/assets/img/kartra-logo.png">
    <button class="btn btn-success">
      <i class="fas fa-check-circle"></i> Done &amp; Exit
    </button>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.topmenu {
  background: #444;
  color: white;
  display: flex;
  justify-content: space-between;

  img {
    height: 50px;
    width: auto;
    margin: auto 10px;
  }
  
  button {
    background: #86c92f;
    border-color: #86c92f;
    padding: 5px 15px;
    margin: 10px;
    font-size: 12px;

    i {
      margin: 0 5px 0 0;
      font-size: 14px;
      vertical-align: middle;
    }

    &:hover {
      transition: all 0.3s ease-in-out;
        color: #fff;
        background: #6aa025;
        border-color: #659723;
    }
  }
}
</style>