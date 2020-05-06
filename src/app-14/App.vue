<template>
  <div class="builder">
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
import { globalConfig as gc } from './config/global.config';
import TopmenuVue from './components/topmenu/Topmenu.vue';
import ToolboxVue from './components/toolbox/Toolbox.vue';
import GridContentVue from './components/grid/Gridcontent.vue';
import { gridHistoryService } from './models/grid/services/gridHistory.service'
import { gridIOservice } from './models/grid/services/gridIO.service'
import { gridLinksService } from './models/grid/services/gridLinks.service';
import { resizeService } from './services/resize.service'

export default {
  components: {
    krtTopmenu: TopmenuVue,
    krtToolbox: ToolboxVue,
    krtGrid: GridContentVue
  },
  data() {
    return {
      toolboxWidth: gc.toolboxWidth,
      topmenuHeight: gc.topmenuHeight
    };
  },
  methods: {
    hideLoadingIcon() {
      document.querySelector('.loading-icon').style.visibility = 'hidden'
    }
  },
  mounted() {
    document.body.onresize = resizeService.resize
    
    /** @TODO - match an id of a sequence to get the output  */
    if (localStorage.getItem('gridModel.model')) {
        gridIOservice.loadGridModel(JSON.parse(localStorage.getItem('gridModel.model')))
        this.hideLoadingIcon()

        gridLinksService.buildLinks()
        gridHistoryService.saveState()
        localStorage.removeItem('gridModel.model')
        return
    }
    
    let modelType = null
    const matchRef = globalThis.location.search.match(/model\=([\w\-]+)/)
    if (matchRef && matchRef[1]) modelType = matchRef[1]

    if (!modelType) {
      gridIOservice.newGridModel()
      this.hideLoadingIcon()
      return
    }

    fetch(`/src/app-14/assets/data/model-${modelType}.json`)
      .then(data => data.json())
      .then(model => { 
        gridIOservice.loadGridModel(model)
        this.hideLoadingIcon()

        gridLinksService.buildLinks()
        gridHistoryService.saveState()
      })
      .catch(error => {
        console.error(error)
      })
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

