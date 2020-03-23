<template>
  <div class="colors">
    <div class="form-group">
      <h4>Color</h4>
      <select
        class="form-control"
        @change="selectColor($event.target.value)"
        :style="{'background-color': bgColor}">
        <option 
            v-for="bgColor of bgColors"
            :value="bgColor"
            :style="{'background-color': bgColor}"
        >&nbsp;</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
    props: ['bgColor', 'bgColors'],
    methods: {
        selectColor(color) {
            this.bgColor = color
            this.$emit('changeBgColor', this.bgColor)
        }
    }
};
</script>

<style lang="scss" scoped></style>