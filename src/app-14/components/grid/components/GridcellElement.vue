<template>
  <div
    class="gridcell-element"
    :class="gridcellElementClass"
    @mouseenter="showModifications = true"
    @mouseleave="showModifications = false"
  >
    <krt-gridtool-modifications
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
    gridcellElementClass() {
      return {
        [`zoom-${globalConfig.zoomLevel}`]: true
      }
    }
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
  
  &.zoom-50 {
    width: 70px;
    height: 70px;
    top: 25px;
    left: 25px;
    .gridtool {
      padding: 20px;
      border-radius: 7.5px;
      i { font-size: 26px; }
    }
  }
  &.zoom-75 {
    width: 105px;
    height: 105px;
    top: 37.5px;
    left: 37.5px;
    .gridtool {
      padding: 30px;
      border-radius: 11.25px;
      i { font-size: 42px; }
    }
  }
  &.zoom-100 {
    width: 140px;
    height: 140px;
    top: 50px;
    left: 50px;
    .gridtool {
      padding: 40px;
      border-radius: 15px;
      i { font-size: 56px; }
    }
  }
  &.zoom-125 {
    width: 175px;
    height: 175px;
    top: 62.5px;
    left: 62.5px;
    .gridtool {
      padding: 50px;
      border-radius: 18.75px;
      i { font-size: 70px; }
    }
  }
  &.zoom-150 {
    width: 210px;
    height: 210px;
    top: 75px;
    left: 75px;
    .gridtool {
      padding: 60px;
      border-radius: 22.5px;
      i { font-size: 84px; }
    }
  }
  
}
</style>