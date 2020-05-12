
import { Utils } from "../../../../utils/utils"
import { UtilsStrings } from "../../../../utils/utilsStrings"
import { gridModel } from "../../grid.model"
import { gridLinksBuilderService } from "../../services/grid-links/gridLinksBuilder.service"
import { LinkNamePositioner } from "./LinkNamePositioner"

const linkNameHelper = {
    gridLinkNamesElements: {},

    generateGridLinkNameElements() {
        const promisesForElements = []
        return new Promise((resolve, _) => {
            this.gridLinkNamesElements = {}

            const linkKeys = Object.keys(gridModel.model.linkAttributes)
            for (const linkKey of linkKeys) {
                const { name } =  gridModel.model.linkAttributes[linkKey]
                if (!name) continue

                const query = { name, linkKey }
                promisesForElements.push(
                    this.setGridLinkNameElement(query)
                )
            }

            Promise.all(promisesForElements).then(_ => resolve())
        })
    },
    setGridLinkNameElement(query) {
        return new Promise((resolve, _) => {
            const { name, linkKey } = query

            const parsedName = UtilsStrings.splitStringInHalfByWord(name, 20)
            const existingGridLinkNameEl = this.gridLinkNamesElements[linkKey]
    
            if (existingGridLinkNameEl) {
                existingGridLinkNameEl.innerHTML = parsedName
                return
            }
    
            const newGridLinkNameEl = linkNameHelper.gridLinkNamesEl.cloneNode()
            newGridLinkNameEl.style.display = 'none'
            newGridLinkNameEl.innerHTML = parsedName
                
        
            document.querySelector('.gridcontent').append(newGridLinkNameEl)
            this.gridLinkNamesElements[linkKey] = newGridLinkNameEl

            resolve()
        })
    },
    rearangeGridLinkNamesElements() {
        const objectKeys = Object.keys(this.gridLinkNamesElements)

        for (const linkKey of objectKeys) {
            if (!gridLinksBuilderService.svgPaths[linkKey]) continue

            const { svgD, color } = gridLinksBuilderService.svgPaths[linkKey][0]
            const element = this.gridLinkNamesElements[linkKey]
            element.style.display = 'block'
            
            const linkNamePositioner = new LinkNamePositioner({ svgD, element, linkKey })
            const { optimalLeft, optimalTop } = linkNamePositioner.getOptimalPosition()

            Object.assign(element.style, {
                left: `${optimalLeft}px`,
                top: `${optimalTop}px`,
                color
            })
        }
    },

    deleteLinkName(linkKey) {
        gridModel.deleteLinkAttribute(linkKey)
        this.deleteGridLinkNameElement(linkKey)
    },
    deleteGridLinkNameElement(linkKey) {
        const element = this.gridLinkNamesElements[linkKey]
        if (!element) return

        element.remove()
    },
    renameOldLinkKey(oldLinkKey, newLinkKey) {
        return new Promise((resolve, _) => {
            const linkAttribute = gridModel.getLinkAttribute(oldLinkKey)
            if (!linkAttribute) return
            
            linkAttribute.linkKey = newLinkKey
            Utils.renameObjKey(this.gridLinkNamesElements, oldLinkKey, newLinkKey)

            resolve()
        })
    },
    removeAllGridLinkNameElements() {
        for (const linkKey in this.gridLinkNamesElements)
            this.deleteGridLinkNameElement(linkKey)

        this.gridLinkNamesElements = {}
    },
    get gridLinkNamesEl() {
        return document.querySelector('.grid-link-name')
    }
}

globalThis.linkNameHelper = linkNameHelper
export { linkNameHelper }
