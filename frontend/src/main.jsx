import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import "bootstrap/dist/css/bootstrap.min.css"; // 1) Bootstrap trước               // 1) Global của bạn
import "./styles/premium.css";                 // 2) Premium/Global của bạn
import "./styles/responsive.css";              // 3) Responsive
import "./styles/client.css";                  // 4) Nút & Hero (để override ở cuối)
import "./index.css";  

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
