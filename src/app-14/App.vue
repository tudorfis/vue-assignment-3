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
import { gridModel } from './models/grid.model';
window.gridModel = gridModel

import { globalConfig } from './config/global.config';
import TopmenuVue from './components/topmenu/Topmenu.vue';
import ToolboxVue from './components/toolbox/Toolbox.vue';
import GridContentVue from './components/grid/Gridcontent.vue';

export default {
  components: {
    krtTopmenu: TopmenuVue,
    krtToolbox: ToolboxVue,
    krtGrid: GridContentVue
  },
  data() {
    return {
      toolboxWidth: globalConfig.toolboxWidth,
      topmenuHeight: globalConfig.topmenuHeight
    };
  },
  computed: {
    builderStyle() {
      return {
        'grid-template-columns': `${this.toolboxWidth}px 1fr`,
        'grid-template-rows': `${this.topmenuHeight}px auto`
      };
    }
  },
  beforeCreate() {
    gridModel.newGridModel()
  }
};
</script>

<style lang="scss">
.builder {
  height: 100%;
  display: grid;
  grid-template-areas:
    'topmenu topmenu'
    'toolbox gridcontent';

  .topmenu {
    grid-area: topmenu;
  }
  .toolbox {
    grid-area: toolbox;
  }
  .gridcontent {
    grid-area: gridcontent;
  }
}

.modal-backdrop {
  z-index: 1;
}

/** @TODO: move/use below classes from existing template */
button.btn-green {
  background: #86c92f;
  border-color: #86c92f;
  padding: 5px 15px;
  margin: 10px;
  font-size: 12px;

  i {
    margin: 0 5px 0 0;
    font-size: 14px;
    vertical-align: middle;
  }

  &:hover {
    transition: all 0.3s ease-in-out;
    color: #fff;
    background: #6aa025;
    border-color: #659723;
  }
}

button.btn-gray {
  background: gray;
  border-color: gray;
  padding: 5px 15px;
  margin: 10px;
  font-size: 12px;
}
</style>

