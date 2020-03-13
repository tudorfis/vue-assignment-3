<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
div {
  border: 1px solid lightseagreen;
  box-shadow: 1px 1px 3px lightseagreen;
  padding: 30px;
  margin: 30px auto;
  text-align: center;
}
h1,
span {
  color: rgb(233, 117, 217);
}
p {
  color: lightseagreen;
}
</style>