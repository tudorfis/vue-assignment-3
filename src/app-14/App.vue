<template>
    <div class="builder" :style="builderStyle">
        <krt-topmenu></krt-topmenu>
        <krt-toolbox></krt-toolbox>
        <krt-grid 
            :toolboxWidth="toolboxWidth"
            :topmenuHeight="topmenuHeight"
        ></krt-grid>
    </div>
</template>

<script>
import TopmenuVue from './components/topmenu/Topmenu.vue'
import ToolboxVue from './components/toolbox/Toolbox.vue'
import GridContentVue from './components/grid/Gridcontent.vue'
export default {
    components: {
        krtTopmenu: TopmenuVue,
        krtToolbox: ToolboxVue,
        krtGrid: GridContentVue
    },
    data() {
        return {
            toolboxWidth: 200,
            topmenuHeight: 60
        }
    },
    computed: {
        builderStyle() {
            return {
                'grid-template-columns': `${this.toolboxWidth}px 1fr`,
                'grid-template-rows': `${this.topmenuHeight}px auto`
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .builder {
        height: 100%;
        display: grid;
        grid-template-areas: 
            "topmenu topmenu"
            "toolbox gridcontent";

        .topmenu { grid-area: topmenu; }
        .toolbox { grid-area: toolbox; }
        .gridcontent { grid-area: gridcontent; }
    }
</style>