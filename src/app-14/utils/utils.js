
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

      for (let i = 0; i < obj.length; i++)
        for (let j = 0; j < obj[i].length; j++)
          output.push(obj[i][j])

      return output
    }
}