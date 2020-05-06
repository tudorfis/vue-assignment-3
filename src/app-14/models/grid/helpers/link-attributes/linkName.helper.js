
import { Utils } from "../../../../utils/utils"
import { UtilsStrings } from "../../../../utils/utilsStrings"
import { gridModel } from "../../grid.model"
import { gridLinksService } from "../../services/gridLinks.service"
import { LinkNamePositioner } from "./LinkNamePositioner"

const linkNameHelper = {
    arangeGridLinkNamesElements() {
        for (const { linkKey } of this.linkAttributes) {
            if (!gridLinksService.svgPaths[linkKey]) continue

            const { svgD, color } = gridLinksService.svgPaths[linkKey][0]
            const element = this.gridLinkNamesElements[linkKey]
            
            const linkNamePositioner = new LinkNamePositioner({ svgD, element, linkKey })
            const { optimalLeft, optimalTop } = linkNamePositioner.getOptimalPosition()

            Object.assign(element.style, {
                left: `${optimalLeft}px`,
                top: `${optimalTop}px`,
                color
            })

        }
    },

    get linkAttributes() {
        if (gridModel.model && gridModel.model.linkAttributes) {
            if (!this.linkAttributesList)
                this.generateList()
                
            return this.linkAttributesList
        }

        return []
    },
    get gridLinkNamesElements() {
        if (!this.gridLinkNamesElementsList)
            this.createGridLinkNamesElements()

        return this.gridLinkNamesElementsList
    },
    createGridLinkNamesElements() {
        this.gridLinkNamesElementsList = {}

        for (const element of this.gridLinkNamesEl.children)
            this.gridLinkNamesElementsList[element.getAttribute('linkKey')] = element
    },

    get gridLinkNamesEl() {
        return document.querySelector('.grid-link-names')
    },
    generateList() {
        this.linkAttributesList = []

        for (const linkKey of this.gridModelLinkKeys) {
            const { name } =  this.gridModelLinkAttributes[linkKey]
            if (!name) continue

            name = UtilsStrings.breaklinehalf(name)
            this.linkAttributesList.push({ name, linkKey })
        }
    },
    get gridModelLinkKeys() {
        return Object.keys(this.gridModelLinkAttributes)
    },
    get gridModelLinkAttributes() {
        return gridModel.model.linkAttributes
    },

    renameOldLinkKey(oldLinkKey, newLinkKey) {
        const linkAttribute = this.findLinkAttribute(oldLinkKey)
        linkAttribute.linkKey = newLinkKey

        const gridLinkNameEl = this.gridLinkNamesElements[oldLinkKey]
        gridLinkNameEl.setAttribute('linkKey', newLinkKey)

        Utils.renameObjKey(this.gridLinkNamesElements, oldLinkKey, newLinkKey)
    },
    
    deleteLinkName(linkKey) {
        const linkAttribute = this.findLinkAttribute(linkKey)
        const index = this.linkAttributesList.indexOf(linkAttribute)
        this.linkAttributesList.splice(index, 1)

        this.deleteGridLinkNameEl(linkKey)
    },
    findLinkAttribute(linkKey) {
        return this.linkAttributesList.filter(item => !!item).find(item => item.linkKey === linkKey)
    },

    deleteGridLinkNameEl(linkKey) {
        const element = this.gridLinkNamesElementsList[linkKey]
        if (!element) return

        element.remove()
    },

    rearange() {
        this.gridLinkNamesEl.__vue__.arangeGridLinkNamesElements()
    }
}

globalThis.linkNameHelper = linkNameHelper
export { linkNameHelper }

