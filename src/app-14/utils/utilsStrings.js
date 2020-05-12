
class UtilsStrings {
    static upperCaseFirstLetter(str) {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    static ucase(str) {
        if (!str) return ''
        return UtilsStrings.upperCaseFirstLetter(str)
    }
    static splitStringInHalfByWord(str, length = 0) {
        if (str.length < length) return str

        let middle = Math.floor(str.length / 2)

        const before = str.lastIndexOf(' ', middle)
        const after = str.indexOf(' ', middle + 1)

        if (middle - before < after - middle) {
            middle = before
        } else {
            middle = after
        }

        const str1 = str.substr(0, middle)
        const str2 = str.substr(middle + 1) 
        
        return str1 + '<br>' + str2
    }
}

globalThis.UtilsStrings = UtilsStrings
export { UtilsStrings }
