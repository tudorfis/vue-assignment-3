
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
}