
export default {
    mounted() {
      const sliderEl = document.querySelector('.gridcontent')
      let startedHtmlScroll = false
      let startX, startY

      sliderEl.addEventListener('mousedown', event => {
        if (!event.path[0].classList.contains('gridcell')) return

        document.body.style.cursor = 'grab';
        startedHtmlScroll = true

        startX = event.pageX
        startY = event.pageY
      })
      
      sliderEl.addEventListener('mouseleave', _=> {
        document.body.style.cursor = 'auto';
        startedHtmlScroll = false
      })

      sliderEl.addEventListener('mouseup', _=> {
        document.body.style.cursor = 'auto';
        startedHtmlScroll = false        
      })

      document.querySelector('html').addEventListener('mousemove', event => {
        if(!startedHtmlScroll) return
        event.preventDefault()

        const scrollLeft = (startX - event.pageX) / 18
        const scrollTop = (startY - event.pageY) / 9
        const html = document.querySelector('html')
        
        html.scrollLeft += scrollLeft
        html.scrollTop += scrollTop
      })
    }
}