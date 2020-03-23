<template>
  <div class="gridcell" :style="dimensions">&nbsp;</div>
</template>

<script>
export default {
  props: ['width', 'height'],
  computed: {
    dimensions() {
      return {
        width: `${this.width}px`,
        height: `${this.height}px`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    
</style>