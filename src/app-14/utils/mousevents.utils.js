export class MouseEventsUtils {
    static stillInsideElement(htmlElement, mouseEvent) {
        const rect = htmlElement.getBoundingClientRect();
        
        const isBetweenLeftRight = mouseEvent.clientX > rect.left && mouseEvent.clientX < rect.right
        const isBetweenTopBottom = mouseEvent.clientY > rect.top && mouseEvent.clientY < rect.bottom

        return isBetweenLeftRight && isBetweenTopBottom
    }
}