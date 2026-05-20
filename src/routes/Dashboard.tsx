import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useWebSocket } from '../hooks/useWebSocket'
import { useHistory } from '../hooks/useHistory'
import { api, type ApiError } from '../lib/api'
import CNPJForm from '../components/CNPJForm'
import CNPJResult, { type CNPJData } from '../components/CNPJResult'
import HistoryList from '../components/HistoryList'

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
  const { connected, lastEvent } = useWebSocket(token)
  const history = useHistory()

  const [result, setResult] = useState<CNPJResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [queued, setQueued] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pendingCNPJ, setPendingCNPJ] = useState<string | null>(null)

  // Quando recebemos evento WS, se for do CNPJ que estamos esperando,
  // busca os dados via GET e mostra o card + adiciona ao historico.
  useEffect(() => {
    if (!lastEvent || !pendingCNPJ) return
    if (lastEvent.cnpj !== pendingCNPJ) return

    const fetchData = async () => {
      try {
        const data = await api<CNPJResponse>(`/cnpj/${pendingCNPJ}`, { token })
        setResult(data)
        setQueued(null)
        setPendingCNPJ(null)
        if (data.data?.nome) {
          history.add(data.cnpj, data.data.nome)
        }
      } catch (e) {
        console.error('erro ao buscar dados apos evento WS:', e)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEvent, pendingCNPJ, token])

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
    setPendingCNPJ(null)

    try {
      const data = await api<CNPJResponse>(`/cnpj/${cnpj}`, {
        method: 'POST',
        token,
      })

      if (data.status === 'enfileirado') {
        setQueued(data.mensagem || 'Aguardando worker processar...')
        setPendingCNPJ(cnpj)
      } else {
        setResult(data)
        if (data.data?.nome) {
          history.add(data.cnpj, data.data.nome)
        }
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
      <header className="border-b border-slate-800 px-4 sm:px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-emerald-400">CNPJ.dev</h1>
            <span
              title={connected ? 'WebSocket conectado' : 'WebSocket desconectado'}
              className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-600'}`}
            />
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm text-slate-300">{user.name}</span>
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Consultar CNPJ</h2>
          <p className="text-sm text-slate-400">
            Digite o CNPJ (com ou sem formatação) para consultar dados cadastrais.
          </p>
        </div>

        <div className="mb-6">
          <CNPJForm loading={loading} onSubmit={handleConsult} />
        </div>

        <HistoryList items={history.items} onSelect={handleConsult} onClear={history.clear} />

        {queued && (
          <div className="rounded-md bg-blue-950 border border-blue-900 p-4 mb-6 text-sm text-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <p className="font-medium">Aguardando worker processar...</p>
            </div>
            <p className="text-xs text-blue-300">
              {queued} O resultado aparecerá automaticamente quando estiver pronto.
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
