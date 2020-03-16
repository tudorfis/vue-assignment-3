
export const animateWidthMixin = {
  data() {
    return {
      load: true,
      elementWidth: 100,
    }
  },
  methods: {
    beforeEnter(el) {
      console.log('beforeEnter');
      this.elementWidth = 100;
      el.style.width = `${this.elementWidth}px`;
    },
    enter(el, done) {
      console.log('enter');
      let round = 1;
      const interval = setInterval(_ => {
        el.style.width = `${this.elementWidth + round * 10}px`;
        round++;
        if (round > 20) {
          clearInterval(interval);
          done();
        }
      }, 20);
    },
    afterEnter(el) {
      console.log('afterEnter');
    },
    enterCancelled(el) {
      console.log('enterCancelled');
    },
    beforeLeave(el) {
      console.log('beforeLeave');
      this.elementWidth = 300;
      el.style.width = `${this.elementWidth}px`;
    },
    leave(el, done) {
      console.log('leave');
      let round = 1;
      const interval = setInterval(_ => {
        el.style.width = `${this.elementWidth - round * 10}px`;
        round++;
        if (round > 20) {
          clearInterval(interval);
          done();
        }
      }, 10);
    },
    afterLeave(el) {
      this.elementWidth = 100;
      el.style.width = `${this.elementWidth}px`;
      console.log('afterLeave');
    },
    leaveCancelled(el) {
      console.log('leaveCancelled');
    }
  }
}