<template>
  <div class="toolbox" @mouseover="resetGridView" :style="toolboxStyle">
    <krt-send-email class="tool" :style="toolStyle"></krt-send-email>
    <krt-send-sms class="tool" :style="toolStyle"></krt-send-sms>
    <krt-add-remove-tag class="tool" :style="toolStyle"></krt-add-remove-tag>

    <krt-send-email-modal></krt-send-email-modal>
    <krt-send-sms-modal></krt-send-sms-modal>
    <krt-add-remove-tags-modal></krt-add-remove-tags-modal>
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
export default {
  mixins: [mousemoveMixin],
  components: {
    krtSendEmail: SendEmailVue,
    krtSendSms: SendSmsVue,
    krtAddRemoveTag: AddRemoveTagVue,
    krtSendEmailModal: SendEmailModalVue,
    krtSendSmsModal: SendSmsModalVue,
    krtAddRemoveTagsModal: AddRemoveTagsModalVue
  },
  computed: {
    toolboxStyle() {
      return {
        width: `${globalConfig.toolboxWidth}px`,
        top: `${globalConfig.topmenuHeight}px`
      }
    },
    toolStyle() {
      let width = globalConfig.gridCellElementWidth
      width -= Math.round(width / 7)
      
      let height = globalConfig.gridCellElementHeight
      height -= Math.round(height / 7)
      
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
    position: fixed;
    z-index: 2;
    background: #3792bc;
    color: white;
    box-shadow: 2px 0px 5px #1e7baf;
    
    .tool {
      &:hover {
        cursor: move;
      }

      width: 120px;
      height: 120px;
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