import TopInterface from "./TopInterface";

export default class TopA extends TopInterface {
    constructor() {
        super()
        this.color = 'blue'
    }
    printTitle() {
        return 'top A'
    }
}
