import { StrictMode } from 'react'
import './i18n'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initCMSData } from './pages/admin/cmsStore'

const render = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

// Prime CMS cache from backend before first render so consumers read fresh data.
// Cap wait at 1.5s so a slow/unreachable backend can't block the UI —
// localStorage / default data is the fallback.
Promise.race([
  initCMSData(),
  new Promise((resolve) => setTimeout(resolve, 1500)),
]).finally(render)
