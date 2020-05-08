
import { Utils } from "../../../../utils/utils"
import { UtilsStrings } from "../../../../utils/utilsStrings"
import { gridModel } from "../../grid.model"
import { gridLinksBuilderService } from "../../services/grid-links/gridLinksBuilder.service"
import { LinkNamePositioner } from "./LinkNamePositioner"

const linkNameHelper = {
    arangeGridLinkNamesElements() {
        const vm = this

        setTimeout(function() {
            for (const { linkKey } of vm.linkAttributes) {
                if (!gridLinksBuilderService.svgPaths[linkKey]) continue
    
                const { svgD, color } = gridLinksBuilderService.svgPaths[linkKey][0]
                
                if (!vm.gridLinkNamesElements[linkKey])
                    vm.patchGridLinkNameElement(linkKey)
    
                const element = vm.gridLinkNamesElements[linkKey]
                
                const linkNamePositioner = new LinkNamePositioner({ svgD, element, linkKey })
                const { optimalLeft, optimalTop } = linkNamePositioner.getOptimalPosition()
    
                Object.assign(element.style, {
                    left: `${optimalLeft}px`,
                    top: `${optimalTop}px`,
                    color
                })
            }
        }, 0)
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
    patchGridLinkNameElement(linkKey) {
        let gridLinkNameEl
        for (const element of this.gridLinkNamesEl.children) {
            if (element.getAttribute('linkKey') === linkKey) {
                gridLinkNameEl = element
            }
        }

        this.gridLinkNamesElements[linkKey] = gridLinkNameEl
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
            this.setLinkAttribute(name, linkKey)
        }
    },
    get gridModelLinkKeys() {
        return Object.keys(this.gridModelLinkAttributes)
    },
    get gridModelLinkAttributes() {
        return gridModel.model.linkAttributes
    },
    setLinkAttribute(name, linkKey) {
        this.linkAttributesList.push({ name, linkKey })
    },

    renameOldLinkKey(oldLinkKey, newLinkKey) {
        const linkAttribute = this.findLinkAttribute(oldLinkKey)
        if (!linkAttribute) return
        
        linkAttribute.linkKey = newLinkKey

        const gridLinkNameEl = this.gridLinkNamesElements[oldLinkKey]
        gridLinkNameEl.setAttribute('linkKey', newLinkKey)

        Utils.renameObjKey(this.gridLinkNamesElements, oldLinkKey, newLinkKey)
    },
    setNewName(linkKey, newName) {
        if (this.gridLinkNamesElements[linkKey]) {
            const gridLinkNameEl = this.gridLinkNamesElements[linkKey]
            gridLinkNameEl.innerHTML = UtilsStrings.breaklinehalf(newName)
        }
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
    },
    removeAll() {
        for (const linkKey in this.gridLinkNamesElements) {
            const element = this.gridLinkNamesElements[linkKey]
            element.remove()
        }
    }
}

globalThis.linkNameHelper = linkNameHelper
export { linkNameHelper }

