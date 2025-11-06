import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.tsx'
// import App1 from './App1.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* <App1/> */}
  </StrictMode>,
)
