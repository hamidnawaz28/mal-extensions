import { createRoot } from 'react-dom/client'
import '../../base.css'
import ContentScriptContainer from './components/ResponseContainer'

const renderBidButton = () => {
  let cartContainer = null
  const timeInterval = setInterval(() => {
    cartContainer = document.querySelector('#cart-app .warehouse-group')
    if (cartContainer !== null) {
      clearInterval(timeInterval)
      const responseContainer = document.createElement('div')
      cartContainer.append(responseContainer)
      const root = createRoot(responseContainer)
      root.render(<ContentScriptContainer />)
    }
  }, 500)
}

renderBidButton()
