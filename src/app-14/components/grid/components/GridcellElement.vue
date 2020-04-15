<template>
  <div
    class="gridcell-element"
    @mouseenter="showGridArrow"
    @mouseleave="hideGridArrow"
  >
    <krt-gridtool-modifications
      :position="position"
      v-if="showOtherIcons"
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
    <krt-subscribe-list
      ref="subscribelist"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.SUBSCRIBE_LIST"
    ></krt-subscribe-list>
    <krt-subscribe-sequence
      ref="subscribesequence"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.SUBSCRIBE_SEQUENCE"
    ></krt-subscribe-sequence>
    <krt-automation
      ref="automation"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.AUTOMATION"
    ></krt-automation>
    <krt-split
      ref="split"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.SPLIT"
    ></krt-split>
    <krt-go-to
      ref="go-to"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.GO_TO"
    ></krt-go-to>
    <krt-wait
      ref="wait"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.WAIT"
    ></krt-wait>
    <krt-complete
      ref="complete"
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === dragElementsEnum.COMPLETE"
    ></krt-complete>
  </div>
</template>

<script>
import { globalConfig } from '../../../config/global.config';
import { dragElementsEnum } from '../../../services/dragElements.service';
import { gridArrowService } from '../services/gridArrow.service';
import SendEmailVue from '../../toolbox/components/SendEmail.vue';
import SendSmsVue from '../../toolbox/components/SendSms.vue';
import AddRemoveTagVue from '../../toolbox/components/AddRemoveTag.vue';
import GridtoolModificationsVue from './control-components/GridtoolModifications.vue';
import SubscribeListVue from '../../toolbox/components/SubscribeList.vue';
import SubscribeSequenceVue from '../../toolbox/components/SubscribeSequence.vue';
import AutomationVue from '../../toolbox/components/Automation.vue';
import SplitVue from '../../toolbox/components/Split.vue';
import GoToVue from '../../toolbox/components/GoTo.vue';
import WaitVue from '../../toolbox/components/Wait.vue';
import CompleteVue from '../../toolbox/components/Complete.vue';
import { gridPanService } from '../services/gridPan.service';

export default {
  components: {
    krtGridtoolModifications: GridtoolModificationsVue,
    krtSendEmail: SendEmailVue,
    krtSendSms: SendSmsVue,
    krtAddRemoveTag: AddRemoveTagVue,
    krtSubscribeList: SubscribeListVue,
    krtSubscribeSequence: SubscribeSequenceVue,
    krtAutomation: AutomationVue,
    krtSplit: SplitVue,
    krtGoTo: GoToVue,
    krtWait: WaitVue,
    krtComplete: CompleteVue,
  },
  props: ['allowDrop', 'type', 'position'],
  data() {
    return {
      dragElementsEnum,
      globalConfig,
      showOtherIcons: false
    }
  },
  methods: {
    showGridArrow(event) {
      if (gridPanService.startedPan) return

      gridArrowService.init(event)
      
      if (!gridArrowService.startedDrag)
        this.showOtherIcons = !gridArrowService.isHighlight
    },
    hideGridArrow() {
      if (gridPanService.startedPan) return
      
      gridArrowService.destroy()
      this.showOtherIcons = gridArrowService.isHighlight
    }
  }
}
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