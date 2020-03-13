<template>
  <div>
    <h3>New quote</h3>
    <input v-model="check">
  </div>
</template>

<script>
export default {
  data() {
    return {
      check: 'default'
    }
  },
  destroyed() {
    console.log('destroyed')
  },
  deactivated() {
    console.log('deactivated')
  },
  activated() {
    console.log('activated')
  }
}
</script>

<style>

</style>