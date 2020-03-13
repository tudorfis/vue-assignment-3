<template>
  <div class="switch" @click="onClick" :class="{'on': value}">
    <div class="bullet"></div>
  </div>
</template>

<script>
export default {
  props: ['value'],
  methods: {
    onClick() {
      this.$emit('input', !this.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.switch {
  cursor: pointer;
  margin: 0 0 10px;
  height: 24px;
  width: 45px;
  border-radius: 25px;
  position: relative;
  background: #fefefe;
  box-shadow: 1px 0px 4px 0px #ccc;

  .bullet {
    height: 29px;
    width: 28px;
    border-radius: 50%;
    position: absolute;
    left: -2px;
    top: -2px;
    background: #1e7bf7;
    border: 1px solid #1e73a9;
    background: linear-gradient(90deg, #1e7bf7 0%, #1e7bf7 35%, #4c9aff 100%);
  }

  &.on {
    width: 31px;
    border-radius: 25px 0 0 25px;
    background: #ff7290;
    background: linear-gradient( #ff7290 35%, #f05b7b 100%);
    transition: background-color 1.5s, border-radius 1s;

    .bullet {
      transition: left 0.20s;
      left: 20px;
    }
  }
}
</style>>