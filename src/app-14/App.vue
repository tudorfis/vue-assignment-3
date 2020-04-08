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
import { gridModel } from './models/grid/grid.model';
window.gridModel = gridModel

import { globalConfig } from './config/global.config';
import TopmenuVue from './components/topmenu/Topmenu.vue';
import ToolboxVue from './components/toolbox/Toolbox.vue';
import GridContentVue from './components/grid/Gridcontent.vue';
import { zoomService } from './services/zoom.service';
import { gridArrowService } from './components/grid/services/gridArrow.service';
import { gridDeleteService } from './components/grid/services/gridDelete.service';

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
    /** @TODO - match an id of a sequence to get the output  */
    
    let modelType = null
    const matchRef = window.location.search.match(/model\=([\w\-]+)/)
    if (matchRef && matchRef[1]) modelType = matchRef[1]

    if (!modelType) {
      gridModel.newGridModel(undefined, undefined, true)
      return
    }

    fetch(`http://localhost:8080/src/app-14/data/model-${modelType || 'light'}.json`)
      .then(data => data.json())
      .then(model => { gridModel.loadGridModel(model) })
  },
  mounted() {
    document.body.onscroll = function(event) { 
      gridDeleteService.hideArrowDelete()
      gridArrowService.hideArrowConnector()
    }
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

/** @TODO: move/use below classes from existing kartra template */
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

