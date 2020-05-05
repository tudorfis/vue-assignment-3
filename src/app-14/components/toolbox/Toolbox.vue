<template>
  <div 
    class="toolbox"

    @mouseover="grs.resetGridView()"
    :style="toolboxStyle"
    :class="toolboxClass"
  >
    <krt-send-email class="tool"></krt-send-email>
    <krt-send-sms class="tool"></krt-send-sms>
    <krt-add-remove-tag class="tool"></krt-add-remove-tag>
    <krt-subscribe-list class="tool"></krt-subscribe-list>
    <krt-subscribe-sequence class="tool"></krt-subscribe-sequence>
    <krt-automation class="tool"></krt-automation>
    <krt-split class="tool"></krt-split>
    <krt-go-to class="tool"></krt-go-to>
    <krt-wait class="tool"></krt-wait>
    <krt-complete class="tool"></krt-complete>

    <krt-send-email-modal></krt-send-email-modal>
    <krt-send-sms-modal></krt-send-sms-modal>
    <krt-add-remove-tags-modal></krt-add-remove-tags-modal>
    <krt-subscribe-list-modal></krt-subscribe-list-modal>
    <krt-subscribe-sequence-modal></krt-subscribe-sequence-modal>
    <krt-automation-modal></krt-automation-modal>
    <krt-split-modal></krt-split-modal>
    <krt-go-to-modal></krt-go-to-modal>
    <krt-wait-modal></krt-wait-modal>
  </div>
</template>

<script>
import SendEmailVue from './components/SendEmail.vue'
import SendSmsVue from './components/SendSms.vue'
import AddRemoveTagVue from './components/AddRemoveTag.vue'
import SendEmailModalVue from './modals/SendEmailModal.vue'
import SendSmsModalVue from './modals/SendSmsModal.vue'
import AddRemoveTagsModalVue from './modals/AddRemoveTags.vue'
import { globalConfig } from '../../config/global.config'
import SubscribeListModalVue from './modals/SubscribeListModal.vue'
import SubscribeListVue from './components/SubscribeList.vue'
import SubscribeSequenceVue from './components/SubscribeSequence.vue'
import SubscribeSequenceModalVue from './modals/SubscribeSequenceModal.vue'
import AutomationVue from './components/Automation.vue'
import AutomationModalVue from './modals/AutomationModal.vue'
import SplitVue from './components/Split.vue'
import SplitModalVue from './modals/SplitModal.vue'
import GoToVue from './components/GoTo.vue'
import GoToModalVue from './modals/GoToModal.vue'
import WaitVue from './components/Wait.vue'
import WaitModalVue from './modals/WaitModal.vue'
import CompleteVue from './components/Complete.vue'
import { globalResetsService } from '../../services/globalResets.service'
import { DimensionsConfigEnum } from '../../config/dimensions/DimensionsConfigEnum'
export default {
  components: {
    krtSendEmail: SendEmailVue,
    krtSendEmailModal: SendEmailModalVue,
    krtSendSms: SendSmsVue,
    krtSendSmsModal: SendSmsModalVue,
    krtAddRemoveTag: AddRemoveTagVue,
    krtAddRemoveTagsModal: AddRemoveTagsModalVue,
    krtSubscribeList: SubscribeListVue,
    krtSubscribeListModal: SubscribeListModalVue,
    krtSubscribeSequence: SubscribeSequenceVue,
    krtSubscribeSequenceModal: SubscribeSequenceModalVue,
    krtAutomation: AutomationVue,
    krtAutomationModal: AutomationModalVue,
    krtSplit: SplitVue,
    krtSplitModal: SplitModalVue,
    krtGoTo: GoToVue,
    krtGoToModal: GoToModalVue,
    krtWait: WaitVue,
    krtWaitModal: WaitModalVue,
    krtComplete: CompleteVue,
  },
  computed: {
    toolboxStyle() {
      const gc = globalConfig
      return {
        width: `${gc.toolboxWidth}px`,
        top: `${gc.topmenuHeight}px`,
        height: `calc(100% - ${gc.topmenuHeight}px)`
      }
    },
    toolboxClass() {
        return {
            [`square`]: globalConfig.dimensionType === DimensionsConfigEnum.SQUARE,
            [`rectangular`]: globalConfig.dimensionType === DimensionsConfigEnum.RECTANGULAR
        }
    }
  },
  data() {
    return {
      grs: globalResetsService
    }
  }
}
</script>

<style lang="scss">
  .toolbox {
    overflow: auto;
    position: fixed;
    z-index: 3;
    background: #3792bc;
    color: white;
    box-shadow: 2px 0px 5px #1e7baf;
    
    .tool {
      margin: 20px auto;
      border: 0;
      border-radius: 5px;
      box-shadow: 3px 3px 12px #555;
      text-align: center;
      font-weight: bold;

      &:hover {
        cursor: move;
      }
      i {
        font-size: 40px;
      }
    }
  }
</style>