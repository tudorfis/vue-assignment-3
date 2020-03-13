<script>
import { BlinkBackground } from './classes/BlinkBackground.class';
import { BlinkColor } from './classes/BlinkColor.class';
import { StringUtils } from '../../utils/string.utils'

const BlinkClasses = {
  BlinkBackground,
  BlinkColor
};

const createDelay = bindingModifiers => {
  let delay = 0;
  if (bindingModifiers['delayed']) 
    delay = bindingModifiers['fast'] ? 200 : 1000
  
  return delay;
}

const createBlinkStyleObject = (styleType, el) => {
    return new BlinkClasses[`Blink${StringUtils.capitalize(styleType)}`](el)
}

export default {
  bind(el, binding, vnode) {
    if (!binding.arg || !binding.value) return;

    const delay = createDelay(binding.modifiers)
    const blinkStyleObj = createBlinkStyleObject(binding.arg, el)
      
    if (delay) {
      setInterval(_ => {
        blinkStyleObj.blink(el, binding.value)
      }, delay);

      return
    }

    blinkStyleObj.color(el, binding.value)
  }
};
</script>