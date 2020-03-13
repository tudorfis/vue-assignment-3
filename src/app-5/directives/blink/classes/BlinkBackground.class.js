
import { BlinkStylesInterface } from './BlinkStyles.interface'
import { StringUtils } from '../../../utils/string.utils';

export class BlinkBackground extends BlinkStylesInterface {
  constructor(el) {
    super(el)
  }
  blink(el, bindingValue) {
    switch (typeof bindingValue) {
      case 'string':
        const isDefault = (el.style.backgroundColor === this.defaultValue);
        el.style.backgroundColor = isDefault ? bindingValue : this.defaultValue;
        break;
     
      case 'object':
        const isSecondColor = (StringUtils.rgbToHex(el.style.backgroundColor) === bindingValue.secondColor);
        el.style.backgroundColor = isSecondColor ? bindingValue.firstColor : bindingValue.secondColor;
        break
    }
  }
  color(el, bindingValue) {
    el.style.backgroundColor = bindingValue
  }
}
