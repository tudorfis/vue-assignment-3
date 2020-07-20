import TopInterface from "./TopInterface";

export default class TopC extends TopInterface {
    constructor() {
        super()
        this.color = 'lightgreen'
    }
    printTitle() {
        return 'top C'
    }
}
