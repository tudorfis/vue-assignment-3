import TopInterface from "./TopInterface";

export default class TopB extends TopInterface {
    constructor() {
        super()
        this.color = 'red'
    }
    printTitle() {
        return 'top B'
    }
}
