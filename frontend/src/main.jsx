import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './store/useAuthStore.jsx'
import { ThemeProvider } from './store/useThemeStore.jsx'
import { ChatProvider } from './store/useChatStore.jsx'


createRoot(document.getElementById('root')).render(

  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
    <ThemeProvider>
    <ChatProvider>
    <App />
    </ChatProvider>
    </ThemeProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)