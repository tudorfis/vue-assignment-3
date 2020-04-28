
class UtilsStrings {
    static upperCaseFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    static ucase(str) {
        return UtilsStrings.upperCaseFirstLetter(str)
    }
}

export { UtilsStrings }