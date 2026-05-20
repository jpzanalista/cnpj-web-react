import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './contexts/AuthProvider'
import Login from './routes/Login'
import Dashboard from './routes/Dashboard'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

function App() {
  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="min-h-screen bg-slate-900 text-red-400 flex items-center justify-center p-8 text-center">
        VITE_GOOGLE_CLIENT_ID não configurada. Defina em <code>.env</code>.
      </div>
    )
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App
