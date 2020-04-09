<template>
  <div class="toolbox" @mouseover="resetGridView" :style="toolboxStyle">
    <krt-send-email class="tool" :style="toolStyle"></krt-send-email>
    <krt-send-sms class="tool" :style="toolStyle"></krt-send-sms>
    <krt-add-remove-tag class="tool" :style="toolStyle"></krt-add-remove-tag>
    <krt-subscribe-list class="tool" :style="toolStyle"></krt-subscribe-list>
    <krt-subscribe-sequence class="tool" :style="toolStyle"></krt-subscribe-sequence>
    <krt-automation class="tool" :style="toolStyle"></krt-automation>
    <krt-split class="tool" :style="toolStyle"></krt-split>
    <krt-go-to class="tool" :style="toolStyle"></krt-go-to>
    <krt-wait class="tool" :style="toolStyle"></krt-wait>
    <krt-complete class="tool" :style="toolStyle"></krt-complete>

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
import mousemoveMixin from '../../mixins/mousemove.mixin'
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
export default {
  mixins: [mousemoveMixin],
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
      return {
        width: `${globalConfig.toolboxWidth}px`,
        top: `${globalConfig.topmenuHeight}px`,
      }
    },
    toolStyle() {
      let width = globalConfig.gridCellElementWidth
      width += Math.round(width / 7)
      
      let height = globalConfig.gridCellElementHeight
      height += Math.round(height / 7)
      
      return {
        width: `${width}px`,
        height: `${height}px`
      }
    }
  }
}
</script>

<style lang="scss">
  .toolbox {
    height: 100%;
    overflow: auto;
    padding-bottom: 80px;
    position: fixed;
    z-index: 3;
    background: #3792bc;
    color: white;
    box-shadow: 2px 0px 5px #1e7baf;
    
    .tool {
      &:hover {
        cursor: move;
      }

      margin: 20px auto;
      padding: 30px 15px;
      border: 0;
      border-radius: 5px;
      box-shadow: 3px 3px 12px #555;
      text-align: center;
      font-weight: bold;

      i {
        font-size: 40px;
      }
    }
  }
</style>