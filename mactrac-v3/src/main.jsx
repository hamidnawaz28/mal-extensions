import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

const container = document.createElement('div')
container.id = 'mactrac-root'

document.body.appendChild(container)

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
