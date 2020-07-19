<template>
  <div>
    <top />
    <left />
    <bottom />
  </div>
</template>
<script>
import TopVue from './components/Top.vue';
import LeftVue from './components/Left.vue';
import BottomVue from './components/Bottom.vue';
export default {
  components: {
    top: TopVue,
    left: LeftVue,
    bottom: BottomVue
  }
}
</script>