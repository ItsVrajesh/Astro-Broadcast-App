import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// THIS LINE IS CRITICAL. If it's missing, no styles will work!
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
