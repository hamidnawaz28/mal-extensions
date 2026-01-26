import { createRoot } from 'react-dom/client'
import { waitTillActiveTabLoadsBackground } from '../common/browserMethods'
import DownloadImages from './DownloadImages'

const renderBidButton = () => {
  const timeInterval = setInterval(async () => {
    await waitTillActiveTabLoadsBackground()
    const mainContainer = document.querySelector("[data-pl='product-title']")
    const downloadImagesContainer = document.querySelector('#download-images-container')
    if (downloadImagesContainer != null) {
      clearInterval(timeInterval)
      return
    }
    if (mainContainer == null) return
    clearInterval(timeInterval)
    const conditionReference = document.querySelector("[data-pl='product-title']")
    const responseContainer = document.createElement('div')
    responseContainer.id = 'download-images-container'
    conditionReference?.parentElement?.append(responseContainer)
    const root = createRoot(responseContainer)
    root.render(<DownloadImages />)
  }, 1000)
}

renderBidButton()
