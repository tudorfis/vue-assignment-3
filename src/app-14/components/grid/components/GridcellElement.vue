<template>
  <div
    class="gridcell-element"
    @mouseenter="showModifications = true"
    @mouseleave="showModifications = false"
  >
    <krt-gridtool-modifications
      :position="position"
      v-if="showModifications"
    ></krt-gridtool-modifications>
    <krt-send-email
      ref="sendemail"
      class="gridtool"
      :isInsideCell="true"
      v-if="type === dragElementsEnum.SEND_EMAIL"
    ></krt-send-email>
    <krt-send-sms
      ref="sendsms"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.SEND_SMS"
    ></krt-send-sms>
    <krt-add-remove-tag
      ref="addremovetag"
      class="gridtool"
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
import GridtoolModificationsVue from './control-components/GridtoolModifications.vue';
export default {
  components: {
    krtGridtoolModifications: GridtoolModificationsVue,
    krtSendEmail: SendEmailVue,
    krtSendSms: SendSmsVue,
    krtAddRemoveTag: AddRemoveTagVue
  },
  props: ['allowDrop', 'type', 'position'],
  data() {
    return {
      dragElementsEnum,
      globalConfig,
      showModifications: false
    };
  }
};
</script>

<style lang="scss">
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