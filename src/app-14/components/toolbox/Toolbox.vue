<template>
  <div class="toolbox" @mouseover="resetGridView">
    <krt-send-email class="tool"></krt-send-email>
    <krt-send-sms class="tool"></krt-send-sms>
    <krt-add-remove-tag class="tool"></krt-add-remove-tag>

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
export default {
  mixins: [mousemoveMixin],
  components: {
    krtSendEmail: SendEmailVue,
    krtSendSms: SendSmsVue,
    krtAddRemoveTag: AddRemoveTagVue,
    krtSendEmailModal: SendEmailModalVue,
    krtSendSmsModal: SendSmsModalVue,
    krtAddRemoveTagsModal: AddRemoveTagsModalVue
  }
}
</script>

<style lang="scss" scoped>
  .toolbox {
    height: 100%;
    position: fixed;
    width: 200px;
    z-index: 2;
    top: 60px;

    background: #3792bc;
    color: white;
    box-shadow: 2px 0px 5px #1e7baf;
    
    .tool {
      width: 120px;
      height: 120px;
      margin: 20px auto;
      padding: 30px 15px;
      border: 0;
      border-radius: 5px;
      box-shadow: 3px 3px 12px #555;
      text-align: center;
      font-weight: bold;

      &:hover {
        cursor: move;
      }
    }
  }
</style>