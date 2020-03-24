<template>
  <div class="toolbox">
    <krt-send-email class="tool"></krt-send-email>
    <krt-send-sms class="tool"></krt-send-sms>
    <krt-add-remove-tag class="tool"></krt-add-remove-tag>
  </div>
</template>

<script>
import SendEmailVue from './components/SendEmail.vue'
import SendsSmsVue from './components/SendsSms.vue'
import AddRemoveTagVue from './components/AddRemoveTag.vue'
export default {
  components: {
    krtSendEmail: SendEmailVue,
    krtSendSms: SendsSmsVue,
    krtAddRemoveTag: AddRemoveTagVue
  }
}
</script>

<style lang="scss" scoped>
    .toolbox {
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

          &:hover {
            cursor: move;
          }
        }
    }
</style>