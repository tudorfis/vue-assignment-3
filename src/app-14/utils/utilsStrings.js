
class UtilsStrings {
    static upperCaseFirstLetter(str) {
        if (!str) return ''
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
    static ucase(str) {
        if (!str) return ''
        return UtilsStrings.upperCaseFirstLetter(str)
    }
    static findMiddleWord(str) {
        if (!str) return ''
        const halfStr = str.length / 2

        let i, startPos, endPos
        for (i = 1; i <= 20; i++) {
            if (str[halfStr - i] === ' ')
                if (!startPos) startPos = halfStr - i + 1

            if (str[halfStr + i] === ' ') 
                if (!endPos) endPos = halfStr + i

            if (!startPos || !endPos) continue
        }

        return str.slice(startPos, endPos)
    }
    static breaklinehalf(str, length = 40) {
        if (!str) return ''
        if (str.length < length) return str

        const strSplit = str.split(' ')
        const middleWord = UtilsStrings.findMiddleWord(str)

        const halfPosition = strSplit.indexOf(middleWord) + 1

        const firstHalfStr = strSplit.slice(0, halfPosition - 1).join(' ')
        const secondHalfStr = strSplit.slice(halfPosition - 1).join(' ')
        
        return `${firstHalfStr} <br> ${secondHalfStr}`
    }
}

globalThis.UtilsStrings = UtilsStrings
export { UtilsStrings }
