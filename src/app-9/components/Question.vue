<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <h3 class="panel-title text-center">{{ question }}</h3>
    </div>
    <div class="panel-body">
      <div 
        v-for="i of [0,1,2,3]"
        class="col-xs-12 col-sm-6 text-center">
        <button
          class="btn btn-primary btn-lg"
          style="margin: 10px"
          @click="onAnswer(btnData[i].correct)"
        >{{ btnData[i].answer }}</button>
      </div>
    </div>
  </div>
</template>

<script>
const MODE_ADDITION = 1;
const MODE_SUBTRACTION = 2;
export default {
  data() {
    return {
      question: 'Oops, an error ocurred :/',
      btnData: [
        { correct: false, answer: 0 },
        { correct: false, answer: 0 },
        { correct: false, answer: 0 },
        { correct: false, answer: 0 }
      ]
    };
  },
  methods: {
    generateQuestion() {
      const correctAnswer = this.generateCorrectAnswer();
      
      this.generateAnswerButtons(correctAnswer)
      this.generateCorrectButton(correctAnswer)      
    },
    generateCorrectAnswer() {
      const firstNumber = this.generateRandomNumber(1, 100);
      const secondNumber = this.generateRandomNumber(1, 100);
      const modeNumber = this.generateRandomNumber(1, 2);
      let correctAnswer

      switch (modeNumber) {
        case MODE_ADDITION:
          correctAnswer = firstNumber + secondNumber;
          this.question = `What's ${firstNumber} + ${secondNumber}?`;
          break;
      
        case MODE_SUBTRACTION:
          correctAnswer = firstNumber - secondNumber;
          this.question = `What's ${firstNumber} - ${secondNumber}?`;
          break;
        
        default:
          correctAnswer = 0;
          this.question = 'Oops, an Error occurred :/';
      }

      return correctAnswer
    },
    generateAnswerButtons(correctAnswer) {
      const min = correctAnswer - 10
      const max = correctAnswer + 10

      for (let i = 0; i <= 3; i++) {
        this.btnData[i].answer = this.generateRandomNumber(min, max, correctAnswer)
        this.btnData[i].correct = false;
      }
    },
    generateCorrectButton(correctAnswer) {
      const correctButton = this.generateRandomNumber(0, 3);
      this.btnData[correctButton].correct = true;
      this.btnData[correctButton].answer = correctAnswer;
    },
    generateRandomNumber(min, max, except) {
      const rndNumber = Math.round(Math.random() * (max - min)) + min;
      console.log(min, max, rndNumber);
      if (rndNumber == except) {
        return this.generateRandomNumber(min, max, except);
      }
      return rndNumber;
    },
    onAnswer(isCorrect) {
      this.$emit('answered', isCorrect);
    }
  },
  created() {
    this.generateQuestion();
  }
};
</script>

<style>
</style>