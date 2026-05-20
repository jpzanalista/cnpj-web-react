import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-emerald-400">CNPJ.dev</h1>
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-200">
            Sair (provisório)
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="text-slate-400">
          Em breve: formulário de consulta de CNPJ + histórico + eventos em tempo real.
        </p>
      </main>
    </div>
  )
}

export default Dashboard
