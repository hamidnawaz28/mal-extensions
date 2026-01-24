import React from 'react'
import ReactDOM from 'react-dom/client'
import { TrackingApp } from './content-script/generate-tracking'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <TrackingApp />
  </React.StrictMode>,
)
