
export class ViewUtils {
  static toggleComponents(component, selector1, selector2) {
    component = (component === selector1) ? selector2 : selector1
    console.log(component)
  }
}