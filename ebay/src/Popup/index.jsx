import { createRoot } from 'react-dom/client'
import Popup from './Popup'

const renderPopup = async () => {
  const popupContainer = document.createElement('div')
  popupContainer.id = 'popup'

  const root = createRoot(popupContainer)
  root.render(<Popup />)
}

renderPopup()
