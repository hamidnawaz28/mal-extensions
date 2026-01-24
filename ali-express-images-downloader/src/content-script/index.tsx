import { createRoot } from 'react-dom/client'
import DownloadImages from './DownloadImages'

const renderBidButton = () => {
  const timeInterval = setInterval(async () => {
    const mainContainer = document.querySelector("[data-pl='product-title']")
    if (mainContainer == null) return
    clearInterval(timeInterval)
    const conditionReference = document.querySelector("[data-pl='product-title']")
    const responseContainer = document.createElement('div')
    conditionReference?.append(responseContainer)
    const root = createRoot(responseContainer)
    root.render(<DownloadImages />)
  }, 1000)
}

renderBidButton()
