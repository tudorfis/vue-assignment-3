
export class Utils {
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
}