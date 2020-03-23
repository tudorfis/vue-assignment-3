<template>
    <div class="builder">
        <krt-topmenu></krt-topmenu>
        <krt-toolbox></krt-toolbox>
        <krt-grid></krt-grid>
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
    }
}
</script>

<style lang="scss" scoped>
    .builder {
        height: 100%;
        display: grid;
        grid-template-columns: 200px 1fr;
        grid-template-rows: 50px auto;
        grid-template-areas: 
            "topmenu topmenu"
            "toolbox gridcontent";

        .topmenu { grid-area: topmenu; }
        .toolbox { grid-area: toolbox; }
        .gridcontent { grid-area: gridcontent; }
    }
    
</style>