import { createRoot } from 'react-dom/client'
import '../../base.css'
import App from './App'

const renderBidButton = () => {
  const mainContainer = document.querySelector('#root') as HTMLElement
  const root = createRoot(mainContainer)
  root.render(<App />)
}

renderBidButton()
