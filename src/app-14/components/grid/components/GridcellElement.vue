<template>
  <div
    class="gridcell-element"
    :style="gridcellElementStyle"
    @mouseenter="showModifications = true"
    @mouseleave="showModifications = false"
  >
    <krt-gridtool-modifications
      :visible="showModifications"
    ></krt-gridtool-modifications>
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
  props: ['allowDrop', 'type'],
  data() {
    return {
      dragElementsEnum,
      globalConfig,
      showModifications: false
    };
  },
  computed: {
    gridcellElementStyle() {
      const top = (globalConfig.gridCellHeight - globalConfig.gridCellElementHeight) / 2;
      const left = (globalConfig.gridCellWidth - globalConfig.gridCellElementWidth) / 2;

      return {
        top: `${top}px`,
        left: `${left}px`,
        width: `${globalConfig.gridCellElementWidth}px`,
        height: `${globalConfig.gridCellElementHeight}px`
      };
    },
    gridToolStyle() {
      const padding = Math.floor(globalConfig.gridCellElementHeight / 3.5);
      const borderRadius = Math.floor(padding / 2.5);

      return {
        padding: `${padding}px`,
        'border-radius': `${borderRadius}px`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.gridcell-element {
  position: absolute;
  &:hover {
    cursor: move;
  }
  
  .gridtool {
    width: 100%;
    height: 100%;
    text-align: center;
    border: 0;
  }
}
</style>