<template>
  <div class="gridcell-element" :style="gridcellElementStyle">
    <krt-gridtool-modifications style="display: none"></krt-gridtool-modifications>
    <krt-send-email
      ref="sendemail"
      class="gridtool"
      :style="gridToolStyle"
      :isInsideCell="true"
      v-if="type === dragElementsEnum.SEND_EMAIL"
    ></krt-send-email>
    <krt-send-sms
      ref="sendsms"
      class="gridtool"
      :style="gridToolStyle"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.SEND_SMS"
    ></krt-send-sms>
    <krt-add-remove-tag
      ref="addremovetag"
      class="gridtool"
      :style="gridToolStyle"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.ADD_REMOVE_TAG"
    ></krt-add-remove-tag>
  </div>
</template>

<script>
import { dragElementsEnum } from '../../../services/dragElements.service';
import SendEmailVue from '../../toolbox/components/SendEmail.vue';
import SendSmsVue from '../../toolbox/components/SendSms.vue';
import AddRemoveTagVue from '../../toolbox/components/AddRemoveTag.vue';
import { globalConfig } from '../../../config/global.config';
import GridtoolModificationsVue from './GridtoolModifications.vue';
export default {
  components: {
    krtGridtoolModifications: GridtoolModificationsVue,
    krtSendEmail: SendEmailVue,
    krtSendSms: SendSmsVue,
    krtAddRemoveTag: AddRemoveTagVue
  },
  props: ['element', 'type'],
  data() {
    return {
      dragElementsEnum,
      cellWidth: globalConfig.gridCellWidth,
      cellHeight: globalConfig.gridCellHeight,
      width: globalConfig.gridCellElementWidth,
      height: globalConfig.gridCellElementHeight
    };
  },
  computed: {
    gridcellElementStyle() {
      const topBottom = (this.cellHeight - this.height) / 2;
      const leftRight = (this.cellWidth - this.width) / 2;

      return {
        top: `${topBottom}px`,
        left: `${leftRight}px`,
        width: `${this.width}px`,
        height: `${this.height}px`
      };
    },
    gridToolStyle() {
      const padding = Math.floor(this.height / 3.5);
      const borderRadius = Math.floor(padding / 2.5);

      return {
        padding: `${padding}px`,
        'border-radius': `${borderRadius}px`
      };
    }
  },
  mounted() {
    /** the purpose of this is to wait for the
     * element to generate from the v-if v-else-if statements
     * */
    const refs = this.$refs;
    const mountedElement = refs[Object.keys(refs)[0]].$el;
    this.$emit('mountedElement', mountedElement);
  }
};
</script>

<style lang="scss" scoped>
.gridcell-element {
  position: absolute;
  .gridtool {
    width: 100%;
    height: 100%;
    text-align: center;
    border: 0;

    &:hover {
      cursor: move;
    }
  }

  &:hover {
    cursor: move;

    .gridtool-modifications {
      display: block !important;
    }
  }
}
</style>