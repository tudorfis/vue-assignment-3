
export class ObjectUtils {
  
  static validateClass(classObj) {
    if (!classObj || typeof classObj !== 'object')
      throw new Error('Please provide proper classObj interface for validation')
    
    ObjectUtils.validateMethods(classObj,
      ObjectUtils.buildMethods(classObj.__proto__.__proto__))
  }

  static buildMethods(vm) {
    const properties = Object.getOwnPropertyNames(vm).slice(1)
    const methods = {}

    for (const property of properties) {
        const methodName = vm[property].toString().match(/function\s(.+)\(/)[1]
        const paramsNames = vm[property].toString().match(/\((.+)\)/)[1]
        
        methods[methodName] = paramsNames
    }

    return methods
  }

  static validateMethods(vm, methods) {
    if (!vm || !methods)
      throw new Error(`Please provide vm and methods with params as property, eg: {blink: 'el, bindingValue'}`);

    for (const method in methods) {
      if (!vm[method])
        throw new Error(`Required method ${method}() on ${vm.constructor.name}`)

        const matchParams = vm[method].toString().match(/\((.+)\)/)
        
        if (!matchParams || !matchParams[1] || (matchParams[1] != methods[method]))
          throw new Error(`Required method parameters (${methods[method]}) for ${method}() on ${vm.constructor.name}`)
    }
  }
}