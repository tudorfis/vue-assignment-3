

import { BlinkStylesInterface } from './BlinkStyles.interface'
import { StringUtils } from '../../../utils/string.utils';

export class BlinkColor extends BlinkStylesInterface {
  constructor(el) {
    super(el)
  }
  blink(el, bindingValue) {
    switch (typeof bindingValue) {
      case 'string':
        const isDefault = (el.style.color === this.defaultValue);
        el.style.color = isDefault ? bindingValue : this.defaultValue;
        break;
     
      case 'object':
        const isSecondColor = (StringUtils.rgbToHex(el.style.color) === bindingValue.secondColor);
        el.style.color = isSecondColor ? bindingValue.firstColor : bindingValue.secondColor;
        break
    }
  }
  color(el, bindingValue) {
    el.style.color = bindingValue
  }
}
