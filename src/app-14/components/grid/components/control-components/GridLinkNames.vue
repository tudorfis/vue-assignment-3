<template>
  <div
    class="grid-link-names"
    v-if="linkNameHelper.linkAttributes"
  >
    <div
      class="grid-link-name"
      :linkKey="item.linkKey"
      :key="item.linkKey"
      v-html="item.name"
      v-for="item of linkNameHelper.linkAttributes"
    ></div>
  </div>
</template>

<script>
import { linkNameHelper } from '../../../../models/grid/helpers/link-attributes/linkName.helper';
import { gridModel } from '../../../../models/grid/grid.model';
export default {
  data() {
    return {
      linkNameHelper,
      gridModel
    };
  },
  watch: {
    'linkNameHelper.linkAttributes': function(linkAttributes) {
      if (!linkAttributes || !linkAttributes.length) return 
      this.arangeGridLinkNamesElements()
    }
  },
  methods: {
    arangeGridLinkNamesElements() {
      this.$nextTick(() => linkNameHelper.arangeGridLinkNamesElements());
    }
  }
};



</script>

<style lang="scss">
.grid-link-names {
  .grid-link-name {
    position: absolute;
    background: none;
    padding: 0;
    margin: 0;
    font-size: 10px;
    color: #999;
    text-align: center;
    white-space: nowrap;
    z-index: 1;
  }
}
</style>