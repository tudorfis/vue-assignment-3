
export class StringUtils {
  static capitalize(str) {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  static componentToHex(c) {
    const hex = parseInt(c).toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  static rgbToHex(rgbStr) {
    if (!rgbStr || typeof rgbStr !== 'string') return

    let rgb
    try {
      rgb = rgbStr.match(/\((.+)\)/)[1].split(',')
    } catch (e) {
      console.log(e)
      throw new Error('Please provide rgb(0, 12, 10) type of string')
    } 

    let str = '#';
    for (let i = 0; i <= 2; i++)
      str += `${StringUtils.componentToHex(rgb[i])}`
      
    return str;
  }
  
}
