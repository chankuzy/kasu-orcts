import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { ComplaintProvider } from './context/ComplaintContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ComplaintProvider>
        <App />
      </ComplaintProvider>
    </AuthProvider>
  </React.StrictMode>
)
