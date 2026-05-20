import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function Login() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Se já está logado, redireciona pro dashboard.
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError('Google nao retornou credential')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: response.credential }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.erro || `Erro do backend: HTTP ${res.status}`)
        return
      }

      const data = await res.json()
      login(data.user, data.token)
      navigate('/dashboard')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-8 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">CNPJ.dev</h1>
          <p className="text-sm text-slate-400">Consulta de CNPJ com cache e tempo real</p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Login com Google falhou')}
            theme="filled_black"
            shape="rectangular"
            text="signin_with"
          />
        </div>

        {loading && (
          <div className="mt-4 text-center text-xs text-slate-400">Autenticando...</div>
        )}

        {error && (
          <div className="mt-4 rounded-md bg-red-950 border border-red-900 p-3 text-xs text-red-300">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
