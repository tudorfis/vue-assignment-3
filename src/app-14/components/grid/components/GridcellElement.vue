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
      class="gridtool"
      :isInsideCell="true"
      v-if="type === toolboxElementsEnum.SEND_EMAIL"
    ></krt-send-email>
    <krt-send-sms
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.SEND_SMS"
    ></krt-send-sms>
    <krt-add-remove-tag
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.ADD_REMOVE_TAG"
    ></krt-add-remove-tag>
    <krt-subscribe-list
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.SUBSCRIBE_LIST"
    ></krt-subscribe-list>
    <krt-subscribe-sequence
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.SUBSCRIBE_SEQUENCE"
    ></krt-subscribe-sequence>
    <krt-automation
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.AUTOMATION"
    ></krt-automation>
    <krt-split
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.SPLIT"
    ></krt-split>
    <krt-go-to
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.GO_TO"
    ></krt-go-to>
    <krt-wait
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.WAIT"
    ></krt-wait>
    <krt-complete
      class="gridtool"
      :isInsideCell="true"
      v-else-if="type === toolboxElementsEnum.COMPLETE"
    ></krt-complete>
  </div>
</template>

<script>
import { gridArrowConnectorService } from '../services/gridArrowConnector.service';
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
import { toolboxElementsEnum } from '../../toolbox/enum/toolboxElements.enum'

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
      toolboxElementsEnum,
      showOtherIcons: false
    }
  },
  methods: {
    showGridArrow(event) {
      if (gridPanService.startedPan) return

      gridArrowConnectorService.init(event)
      
      if (!gridArrowConnectorService.startedDrag)
        this.showOtherIcons = !gridArrowConnectorService.isHighlight
    },
    hideGridArrow() {
      if (gridPanService.startedPan) return
      
      gridArrowConnectorService.destroy()
      this.showOtherIcons = gridArrowConnectorService.isHighlight
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