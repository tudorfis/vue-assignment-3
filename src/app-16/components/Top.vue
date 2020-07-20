<template>
    <div :style="{ color }">{{ printTitle }}</div>
</template>
<script>
import store from '../store/store'
export default {
    computed: {
        color() {
            return store.TopComponent.color
        },
        printTitle() {
            return store.TopComponent.printTitle()
        }
    }
}
</script>

<style lang="scss" scoped>
    div {
        font-weight: bold;
        font-size: 36px;
    }
</style>