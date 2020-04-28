
class Utils {
    static objfilter(obj, predicate) {
        let result = {}, key;
    
        for (key in obj) {
            if (obj.hasOwnProperty(key) && predicate(obj[key])) {
                result[key] = obj[key]
            }
        }
    
        return result;
    }
    static reduceobj(obj) {
      const output = []
      const keys = Object.keys(obj)

      if (keys && keys.length) {
          
          for (const key of keys) {
            const child = obj[key]
            for (const subChild of child) {
                output.push(subChild)
            }
          }
      }

      return output
    }
    static deepclone(obj) {
        return JSON.parse(JSON.stringify(obj))
    }
    static randomNumber(from, to) {
        return Math.floor(Math.random() * (to + 1)) + from
    }
    static rangeArray(start, end) {
        const output = []
        
        if (start === end)
            output.push(start)

        else if (start > end)
            for (let i = start; i >= end; i--)
                output.push(i)

        else if (end > start)
            for (let i = start; i <= end; i++)
                output.push(i)

        return output
    }
    static arrayHasDuplicates(array) {
        array = array.filter(item => !!item)
        return (new Set(array)).size !== array.length;
    }
    static renameObjKey(obj, oldKey, newKey) {
        if (oldKey !== newKey) {
            Object.defineProperty(obj, newKey,
                Object.getOwnPropertyDescriptor(obj, oldKey));
                
            delete obj[oldKey];
        }
    }
}

globalThis.Utils = Utils
export { Utils }
