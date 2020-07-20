<template>
    <div>{{ printText }}</div>
</template>
<script>
import store from '../store/store'
export default {
    computed: {
        printText() {
            return store.LeftComponent.printText()
        }
    }
}
</script>

<style lang="scss" scoped>
    div {
        font-weight: italic;
        font-size: 21px;
    }
</style>