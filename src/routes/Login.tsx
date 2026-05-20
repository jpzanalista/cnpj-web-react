import { Link } from 'react-router-dom'

function Login() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-slate-800 bg-slate-950 p-8 shadow-xl">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-emerald-400">CNPJ.dev</h1>
          <p className="text-sm text-slate-400">Consulta de CNPJ com cache e tempo real</p>
        </div>

        <button
          type="button"
          className="w-full py-3 rounded-md bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          disabled
        >
          Entrar com Google (em breve)
        </button>

        <div className="mt-6 text-center">
          <Link to="/dashboard" className="text-xs text-slate-500 hover:text-slate-300 underline">
            Ir para dashboard (provisório)
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
