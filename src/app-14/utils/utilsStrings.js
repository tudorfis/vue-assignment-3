
class UtilsStrings {
    static upperCaseFirstLetter(str) {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    static ucase(str) {
        if (!str) return ''
        return UtilsStrings.upperCaseFirstLetter(str)
    }
    static breaklinehalf(str, length = 40) {
        if (!str) return ''
        if (str.length < length) return str

        const halfPosition = str.length / 2
        return `${str.slice(0, halfPosition).trim()} <br> ${str.slice(halfPosition).trim()}`
    }
}

export { UtilsStrings }