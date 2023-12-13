import React from 'react'
import ReactDOM from 'react-dom/client'
import ResponseContainer from './content-script/components/ResponseContainer'
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ResponseContainer />
  </React.StrictMode>,
)
