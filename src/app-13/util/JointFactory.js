export class JointFactory {
    constructor(graphRef = null, elementsRef = null, linksRef = null) {
        if (!graphRef || !elementsRef || !linksRef)
            throw new Error('Please provide the graph, elements & links array refference')

        this.graphRef = graphRef
        this.elementsRef = elementsRef
        this.linksRef = linksRef
    }

    createRectangle(text = '', colors = null, position = null, size = null) {
        if (!text || !colors || !position || !size) return

        const rect = new joint.shapes.standard.Rectangle();
        this.elementsRef.push(rect);

        rect.position(position.x, position.y);
        rect.resize(size.width, size.height);

        rect.attr({
            body: { fill: colors.bg  },
            label: {
                text,
                fill: colors.color
            }
        });

        rect.addTo(this.graphRef);
        
        return rect
    }
}