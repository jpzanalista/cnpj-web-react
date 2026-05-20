import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Se não está logado, manda pra login.
  if (!user) {
    return <Navigate to="/" replace />
  }

  const handleLogout = () => {
    logout()
    navigate('/')
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

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
        <p className="text-sm text-slate-400 mb-8">Logado como {user.email}</p>
        <p className="text-slate-400">
          Em breve: formulário de consulta de CNPJ + histórico + eventos em tempo real.
        </p>
      </main>
    </div>
  )
}

export default Dashboard
