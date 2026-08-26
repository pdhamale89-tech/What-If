import React from 'react'
import ReactDOM from 'react-dom/client'
import './lib/chartSetup'
import './styles/dds-tokens.css'
import './styles.css'
import App from './App.jsx'
import { DashboardProvider } from './context/DashboardContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DashboardProvider>
      <App />
    </DashboardProvider>
  </React.StrictMode>,
)
