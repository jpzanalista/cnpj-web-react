import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api, type ApiError } from '../lib/api'
import CNPJForm from '../components/CNPJForm'
import CNPJResult, { type CNPJData } from '../components/CNPJResult'

interface CNPJResponse {
  cnpj: string
  status: string // 'ok' | 'not_found' | 'enfileirado'
  data?: CNPJData
  consultado_em?: string
  mensagem?: string
}

function Dashboard() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()

  const [result, setResult] = useState<CNPJResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [queued, setQueued] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleConsult = async (cnpj: string) => {
    setLoading(true)
    setError(null)
    setResult(null)
    setQueued(null)

    try {
      const data = await api<CNPJResponse>(`/cnpj/${cnpj}`, {
        method: 'POST',
        token,
      })

      if (data.status === 'enfileirado') {
        setQueued(data.mensagem || 'Consulta enfileirada. Tente novamente em alguns segundos.')
      } else {
        setResult(data)
      }
    } catch (e) {
      const apiErr = e as ApiError
      if (apiErr.status === 401) {
        logout()
        navigate('/')
        return
      }
      setError(apiErr.message || 'Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-400">CNPJ.dev</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300">{user.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-slate-200 underline"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Consultar CNPJ</h2>
          <p className="text-sm text-slate-400">
            Digite o CNPJ (com ou sem formatação) para consultar dados cadastrais.
          </p>
        </div>

        <div className="mb-8">
          <CNPJForm loading={loading} onSubmit={handleConsult} />
        </div>

        {queued && (
          <div className="rounded-md bg-blue-950 border border-blue-900 p-4 mb-6 text-sm text-blue-200">
            <p className="font-medium mb-1">⏳ Consulta em processamento</p>
            <p>{queued}</p>
            <p className="text-xs text-blue-300 mt-2">
              Clique em &quot;Consultar&quot; novamente em alguns segundos.
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-950 border border-red-900 p-4 mb-6 text-sm text-red-200">
            {error}
          </div>
        )}

        {result?.data && <CNPJResult data={result.data} consultadoEm={result.consultado_em} />}
      </main>
    </div>
  )
}

export default Dashboard
