import { globalResetsService } from "../../../services/globalResets.service"

export const gridPanService = {
    startedPan: false,
    init(sliderEl) {
        this.startedPan = false

        sliderEl.addEventListener('mousedown', event => {
            if (!event.path[0].classList.contains('gridcell')) return
            globalResetsService.reset()
            
            this.startedPan = true
            sliderEl.style.cursor = 'grab';
        })
        sliderEl.addEventListener('mouseup', _=> {
            this.startedPan = false        
            sliderEl.style.cursor = 'auto';
        })

        sliderEl.addEventListener('mouseleave', _=> {
            this.startedPan = false        
            sliderEl.style.cursor = 'auto';
        })
        
        sliderEl.addEventListener('mousemove', event => {
            if(!this.startedPan) return
            event.preventDefault()

            sliderEl.scrollBy(event.movementX * 2, event.movementY * 2)
        })

        sliderEl.onscroll = function() { 
            globalResetsService.reset()
        }
    }
}