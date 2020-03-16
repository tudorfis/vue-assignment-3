<template>
  <div class="container">
    <div class="row">
      <div class="col-xs-12">
        <h3 class="text-center">The Super Quiz</h3>
      </div>
      <hr>
      <div class="row">
        <div class="col-xs-12">
          <transition name="flip" mode="out-in">
            <component
              :is="mode"
              @answered="answered"
              @confirmed="mode = 'app-question'"
            ></component>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuestionVue from './components/Question.vue';
import AnswerVue from './components/Answer.vue';
export default {
  components: {
    appQuestion: QuestionVue,
    appAnswer: AnswerVue
  },
  data() {
    return {
      mode: 'app-question'
    };
  },
  methods: {
    answered(isCorrect) {
      if (isCorrect) {
        this.mode = 'app-answer'
      } else {
        this.mode = 'app-question'
        alert('Wrong answer!')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
  .flip-enter {
    // transform: : rotateY(0deg);
  }
  .flip-enter-active {
    animation: flip-in 0.3s ease-out forwards;
  }
  .flip-leave {
    // transform: rotateY(0deg)
  }
  .flip-leave-active {
    animation: flip-out 0.3s ease-out forwards;
  }
  @keyframes flip-out {
      from { transform: rotateY(0deg); }
      to { transform: rotateY(90deg); }
  }
  @keyframes flip-in {
      from { transform: rotateY(90deg); }
      to { transform: rotateY(0deg); }
  }
</style>