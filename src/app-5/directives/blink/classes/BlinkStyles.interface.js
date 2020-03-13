import { ObjectUtils } from "../../../utils/object.utils"

export class BlinkStylesInterface {
  constructor(el) {
    ObjectUtils.validateClass(this)

    this.defaultValue = el.style.backgroundColor
  }
  blink(el, bindingValue) {
    return void 0
  }
  color(el, bindingValue) {
    return void 0
  }
}