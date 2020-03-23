<template>
  <div id="paper">
    <div class="paper-controls">
      <app-paper-zoom :paper="paper"></app-paper-zoom>
      <app-paper-colors
        :paper="paper"
        :bgColor="defaultBgColor"
        :bgColors="bgColors"
        @changeBgColor="graph.$el.style.background = $event"
      ></app-paper-colors>
    </div>
    <div class="clearboth">&nbsp;</div>
    <slot name="graph" ref="graph"></slot>
  </div>
</template>

<script>
import ZoomVue from './paper-components/Zoom.vue';
import ColorsVue from './paper-components/Colors.vue';
import colorsMixin from './paper-mixins/colorsMixin';
import { JointFactory } from '../../util/JointFactory'

export default {
  props: ['width', 'height'],
  data() {
    return {
      paper: null,
      graph: null,
      elements: [],
      links: []
    };
  },
  mixins: [colorsMixin],
  components: {
    appPaperZoom: ZoomVue,
    appPaperColors: ColorsVue
  },
  mounted() {
    const vm = this
    window.vm = vm

    this.graph = this.$slots['graph'][0].componentInstance;
    this.paper = new joint.dia.Paper({
      el: this.graph.$el,
      model: this.graph.$data.graphModel,
      width: this.width,
      height: this.height,
      background: { color: this.defaultBgColor }
    });


    /** @TODO: remove */

    // const graph = this.graph.$data.graphModel
    // const jointFactory = new JointFactory(graph, this.elements, this.links);

    // JointFactory.createRectangle(
    //   'Kartra', 
    //   {bg: '#515151', color: 'white' },
    //   { x: 100, y: 30 },
    //   { width: 100, height: 60 }
    // )

    const rect = new joint.shapes.standard.Rectangle();
    this.elements.push(rect);

    rect.position(100, 30);
    rect.resize(100, 60);

    rect.attr({
        body: { fill: '#515151' },
        label: {
            text: 'Kartra',
            fill: 'white'
        }
    });

    rect.addTo(this.graph.$data.graphModel);


    const rect2 = rect.clone();
    this.elements.push(rect);

    rect2.translate(300, 0);
    rect2.attr('label/text', 'Sequences!');
    rect2.addTo(this.graph.$data.graphModel);




    const link = new joint.shapes.standard.Link();
    this.links.push(link);

    link.router('orthogonal');
    link.attr({
      line: {
          stroke: '#515151',
          strokeWidth: 4,
      }
    });

    const linkLabel = {
      markup: [
        {
          tagName: 'circle',
          selector: 'body'
        },
                {
          tagName: 'text',
          selector: 'label'
        },

      ],
      attrs: {
        body: {
            ref: 'label',
            fill: '#515151',
            stroke: '#fff',
            strokeWidth: 3,
            refR: 5,
            refCx: 0,
            refCy: 0
        },
        label: {
          text: 'X',
          fill: '#fff',
          fontSize: 12,
          textAnchor: 'middle',
          yAlignment: 'middle',
          pointerEvents: 'none'
        }
      }
    }
    

    link.source(rect);
    link.target(rect2);
    link.addTo(this.graph.$data.graphModel);
    

    this.paper.on('link:mouseover', linkView => {
        linkView.model.appendLabel(linkLabel);
    });

    this.paper.on('link:mouseout', linkView => {
        linkView.model.removeLabel(linkLabel)
    });


    this.paper.on('link:pointerclick', linkView => {
      vm.links.splice(vm.links.indexOf(linkView.model), 1)
      linkView.model.remove()
    });

  }
};
</script>

<style lang="scss" scoped>
#paper {
  padding: 30px;

  .paper-controls {
    display: flex;
    flex-direction: row;

    div {
      margin-right: 10px;
    }
  }
}
</style>