
export const textManipulationMixin = {
  data() {
    return {
      text31: '',
      text32: ''
    }
  },
  computed: {
    reverseText31() {
      return this.text31
        .split('')
        .reverse()
        .join('');
    },
    countAppendLengthText32() {
      if (!this.text32) return ''
      return `${this.text32} (${this.text32.length})`
    }
  }
}