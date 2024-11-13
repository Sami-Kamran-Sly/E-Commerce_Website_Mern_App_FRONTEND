import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContextInfo from './context/AuthContextInfo.jsx'
import SearchContext from './context/SearchContext.jsx'
import CartContext from './context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextInfo>
      <SearchContext>
        <CartContext>
         <App />
        </CartContext>
      </SearchContext>
    </AuthContextInfo>
  </StrictMode>,
)
