
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

        const x = (startX - event.pageX) * 1.1
        const y = (startY - event.pageY) * 1.1
        const html = document.querySelector('html')
        
        html.scrollLeft += x
        html.scrollTop += y
      })
    }
}